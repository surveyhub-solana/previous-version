'use server';

import { getDatabase } from '@/lib/mongodb';
import { IForm, IFormWithId, FormStats, IFormSubmission } from '@/lib/type';
import crypto from 'crypto';
import {
  FindOneAndUpdateOptions,
  ModifyResult,
  ObjectId,
  WithId,
} from 'mongodb';

/**
 * Creates a new form
 * @param name - The name of the form
 * @param description - The description of the form
 * @param ownerPubkey - The public key of the owner
 * @returns The created form document
 */
export async function createForm({
  name,
  description,
  ownerPubkey,
}: {
  name: string;
  description: string;
  ownerPubkey: string;
}) {
  try {
    // Validate the input parameters
    if (!name || !description || !ownerPubkey) {
      throw new Error('Name, description, and ownerPubkey are required.');
    }

    if (
      typeof name !== 'string' ||
      typeof description !== 'string' ||
      typeof ownerPubkey !== 'string'
    ) {
      throw new Error('Name, description, and ownerPubkey must be strings.');
    }

    // Connect to the database
    const db = await getDatabase();

    // Get the forms collection from the database
    const formsCollection = db.collection('forms');

    // Create the new form data
    const newForm: IForm = {
      name,
      description,
      owner: ownerPubkey,
      created_at: Date.now(),
      content: '[]',
      visits: 0,
      submissions: 0,
      published: false,
    };

    // Save the form to the database
    const result = await formsCollection.insertOne(newForm);

    // Return the form with the _id as a string
    return { ...newForm, _id: result.insertedId.toString() };
  } catch (error) {
    console.error('Error creating form:', error);
    throw new Error('Failed to create form');
  }
}
/**
 * Retrieves all forms from the database
 * @returns An array of all form documents
 */
export async function getAllForms(): Promise<IFormWithId[]> {
  try {
    // Connect to the database
    const db = await getDatabase();

    // Get the forms collection from the database
    const formsCollection = db.collection('forms');

    // Retrieve all forms from the collection
    // Retrieve all forms from the collection
    const forms = (await formsCollection
      .find({ published: true })
      .toArray()) as WithId<IForm>[];

    // Map the results to include _id as a string along with all other fields
    return forms.map((form) => ({
      ...form,
      _id: form._id.toString(),
    }));
  } catch (error) {
    console.error('Error retrieving forms:', error);
    throw new Error('Failed to retrieve forms');
  }
}

/**
 * Retrieves forms owned by the specified public key
 * @param publicKey - The public key of the owner
 * @returns An array of form documents owned by the specified public key
 */
export async function getOwnForms(publicKey: string): Promise<IFormWithId[]> {
  try {
    // Validate the publicKey parameter
    if (!publicKey || typeof publicKey !== 'string') {
      throw new Error('A valid publicKey is required.');
    }

    // Connect to the database
    const db = await getDatabase();

    // Get the forms collection from the database and type it with IForm
    const formsCollection = db.collection<IForm>('forms');

    // Retrieve all forms matching the owner publicKey and cast the result to WithId<IForm>[]
    const forms = (await formsCollection
      .find({ owner: publicKey })
      .toArray()) as WithId<IForm>[];

    // Map the results to include _id as a string along with all other fields
    return forms.map((form) => ({
      ...form,
      _id: form._id.toString(),
    }));
  } catch (error) {
    console.error('Error retrieving forms:', error);
    throw new Error('Failed to retrieve forms');
  }
}
/**
 * Retrieves form statistics from the database
 * @param publicKey - The public key of the owner
 * @param id - The ID of a specific form to filter by (optional)
 * @returns The calculated form statistics
 */
export const getStats = async (
  publicKey: string,
  id = ''
): Promise<FormStats | null> => {
  try {
    // Retrieve forms owned by the specified publicKey
    const forms = await getOwnForms(publicKey);

    // Calculate the statistics
    const visits = forms.reduce(
      (total: number, form) =>
        total + ((id.length > 0 ? form._id === id : true) ? form.visits : 0),
      0
    );
    const submissions = forms.reduce(
      (total: number, form) =>
        total +
        ((id.length > 0 ? form._id === id : true) ? form.submissions : 0),
      0
    );
    const submissionRate = visits !== 0 ? (submissions * 100) / visits : 0;
    const bounceRate = visits !== 0 ? 100 - submissionRate : 0;

    return {
      visits,
      submissions,
      submissionRate,
      bounceRate,
    };
  } catch (error) {
    if (error instanceof Error) {
      console.log({
        status: 'error',
        message: error.message,
      });
      return null;
    }
    console.log({
      status: 'error',
      message: String(error),
    });
    return null;
  }
};
/**
 * Retrieves a form by its ID and owner public key
 * @param id - The ID of the form
 * @param ownerPubkey - The public key of the owner
 * @returns The form document matching the given ID and owner public key, or null if not found
 */
export async function getFormByOwner(
  id: string,
  ownerPubkey: string
): Promise<IFormWithId | null> {
  try {
    // Validate input parameters
    if (!id || typeof id !== 'string' || !ObjectId.isValid(id)) {
      throw new Error('A valid form ID is required.');
    }
    if (!ownerPubkey || typeof ownerPubkey !== 'string') {
      throw new Error('A valid owner publicKey is required.');
    }

    // Connect to the database
    const db = await getDatabase();

    // Get the forms collection from the database and type it with IForm
    const formsCollection = db.collection<IForm>('forms');

    // Retrieve the form matching the ID and owner publicKey
    const form = (await formsCollection.findOne({
      _id: new ObjectId(id),
      owner: ownerPubkey,
    })) as WithId<IForm> | null;

    // If form is found, convert _id to string and return the form
    return form ? { ...form, _id: form._id.toString() } : null;
  } catch (error) {
    console.error('Error retrieving form:', error);
    throw new Error('Failed to retrieve form');
  }
}
/**
 * Retrieves a form by its ID and increments the visits count
 * @param id - The ID of the form
 * @returns The form document with incremented visits, or null if not found
 */
export async function getForm(
  id: string,
  userPubkey: string
): Promise<IFormWithId | boolean> {
  try {
    // Validate input parameters
    if (!id || typeof id !== 'string' || !ObjectId.isValid(id)) {
      throw new Error('A valid form ID is required.');
    }

    // Connect to the database
    const db = await getDatabase();
    const formSubmissionsCollection =
      db.collection<IFormSubmission>('formSubmissions');

    // Check if the author has already submitted to this form
    const existingSubmission = await formSubmissionsCollection.findOne({
      form_id: id,
      author: userPubkey,
    });
    const formsCollection = db.collection<IForm>('forms');
    let form: WithId<IForm> | null;
    if (existingSubmission) {
      // If a submission from this author already exists, return false
      return true
    } else {
      form = await formsCollection.findOneAndUpdate(
        { _id: new ObjectId(id), published: true },
        { $inc: { visits: 1 } }, // Increment the visits field by 1
        { returnDocument: 'after' } // Return the updated document
      );
    }
    // Check if the form was found and updated
    if (!form) {
      // If no form is found, return null
      return false;
    }
    // Return the updated form with _id as a string
    return { ...form, _id: form._id.toString() };
  } catch (error) {
    console.error('Error retrieving form:', error);
    throw new Error('Failed to retrieve form');
  }
}
/**
 * Updates the content of a form
 * @param id - The ID of the form
 * @param new_content - The new content to update
 * @param ownerPubkey - The public key of the owner
 * @returns A boolean indicating whether the update was successful
 */
export async function updateFormContent(
  id: string,
  new_content: string,
  ownerPubkey: string
): Promise<boolean> {
  try {
    // Validate input parameters
    if (!id || typeof id !== 'string' || !ObjectId.isValid(id)) {
      throw new Error('A valid form ID is required.');
    }
    if (!new_content || typeof new_content !== 'string') {
      throw new Error('New content must be a valid string.');
    }
    if (!ownerPubkey || typeof ownerPubkey !== 'string') {
      throw new Error('A valid owner publicKey is required.');
    }

    // Connect to the database
    const db = await getDatabase();

    // Get the forms collection from the database
    const formsCollection = db.collection<IForm>('forms');

    // Update the content of the form that matches the ID and owner publicKey
    const result = await formsCollection.updateOne(
      { _id: new ObjectId(id), owner: ownerPubkey },
      { $set: { content: new_content } }
    );

    // Return true if the update was successful (matched a form and modified)
    return result.matchedCount > 0 && result.modifiedCount > 0;
  } catch (error) {
    console.error('Error updating form content:', error);
    return false;
  }
}
/**
 * Publishes a form by setting the 'published' status to true
 * @param id - The ID of the form
 * @param ownerPubkey - The public key of the owner
 * @returns A boolean indicating whether the operation was successful
 */
export async function publishForm(
  id: string,
  ownerPubkey: string
): Promise<boolean> {
  try {
    // Validate input parameters
    if (!id || typeof id !== 'string' || !ObjectId.isValid(id)) {
      throw new Error('A valid form ID is required.');
    }
    if (!ownerPubkey || typeof ownerPubkey !== 'string') {
      throw new Error('A valid owner publicKey is required.');
    }

    // Connect to the database
    const db = await getDatabase();

    // Get the forms collection from the database
    const formsCollection = db.collection<IForm>('forms');

    // Update the 'published' status of the form that matches the ID and owner publicKey
    const result = await formsCollection.updateOne(
      { _id: new ObjectId(id), owner: ownerPubkey },
      { $set: { published: true } }
    );

    // Return true if the update was successful (matched a form and modified)
    return result.matchedCount > 0 && result.modifiedCount > 0;
  } catch (error) {
    console.error('Error publishing form:', error);
    return false;
  }
}
/**
 * Deletes a form and all related form submissions
 * @param id - The ID of the form to delete
 * @param ownerPubkey - The public key of the owner
 * @returns A boolean indicating whether the deletion was successful
 */
export async function deleteForm(
  id: string,
  ownerPubkey: string
): Promise<boolean> {
  try {
    // Validate input parameters
    if (!id || typeof id !== 'string' || !ObjectId.isValid(id)) {
      throw new Error('A valid form ID is required.');
    }
    if (!ownerPubkey || typeof ownerPubkey !== 'string') {
      throw new Error('A valid owner publicKey is required.');
    }

    // Connect to the database
    const db = await getDatabase();

    // Get the forms and formSubmissions collections from the database
    const formsCollection = db.collection<IForm>('forms');
    const formSubmissionsCollection =
      db.collection<IFormSubmission>('formSubmissions');

    // Delete the form that matches the ID and owner publicKey
    const deleteFormResult = await formsCollection.deleteOne({
      _id: new ObjectId(id),
      owner: ownerPubkey,
    });

    if (deleteFormResult.deletedCount === 0) {
      // If no form was deleted, return false
      return false;
    }

    // Delete all form submissions related to the deleted form
    await formSubmissionsCollection.deleteMany({
      form_id: id,
    });

    // Return true if both the form and its submissions were successfully deleted
    return true;
  } catch (error) {
    console.error('Error deleting form and its submissions:', error);
    return false;
  }
}
/**
 * Submits a form submission and increments the submission count on the form
 * Ensures that no duplicate submissions from the same author exist for the form
 * @param id - The ID of the form being submitted to
 * @param content - The content of the submission
 * @param authorPubkey - The public key of the author
 * @returns A boolean indicating whether the submission was successful
 */
export async function submitForm(
  id: string,
  content: string,
  authorPubkey: string
): Promise<boolean> {
  try {
    // Validate input parameters
    if (!id || typeof id !== 'string' || !ObjectId.isValid(id)) {
      throw new Error('A valid form ID is required.');
    }
    if (!content || typeof content !== 'string') {
      throw new Error('Content must be a valid string.');
    }
    if (!authorPubkey || typeof authorPubkey !== 'string') {
      throw new Error('A valid author publicKey is required.');
    }

    // Connect to the database
    const db = await getDatabase();

    // Get the formSubmissions and forms collections from the database
    const formSubmissionsCollection =
      db.collection<IFormSubmission>('formSubmissions');
    const formsCollection = db.collection<IForm>('forms');

    // Check if the author has already submitted to this form
    const existingSubmission = await formSubmissionsCollection.findOne({
      form_id: id,
      author: authorPubkey,
    });

    if (existingSubmission) {
      // If a submission from this author already exists, return false
      console.error('Submission already exists for this author.');
      return false;
    }

    // Create the new form submission
    const newSubmission: IFormSubmission = {
      form_id: id,
      author: authorPubkey,
      created_at: Date.now(),
      content,
    };

    // Insert the new form submission into the database
    const submissionResult = await formSubmissionsCollection.insertOne(
      newSubmission
    );

    if (!submissionResult.acknowledged || !submissionResult.insertedId) {
      // If the insertion failed, return false
      return false;
    }

    // Increment the submissions count on the form
    const formUpdateResult = await formsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { submissions: 1 } }
    );

    // Return true if both the submission was successful and the form was updated
    return (
      formUpdateResult.matchedCount > 0 && formUpdateResult.modifiedCount > 0
    );
  } catch (error) {
    console.error('Error submitting form:', error);
    return false;
  }
}
/**
 * Retrieves a form along with its submissions
 * @param id - The ID of the form
 * @param ownerPubkey - The public key of the owner
 * @returns An object containing the form and its submissions, or null if not found
 */
export async function getFormWithSubmissions(
  id: string,
  ownerPubkey: string
): Promise<{ form: IFormWithId; submissions: IFormSubmission[] } | null> {
  try {
    // Validate input parameters
    if (!id || typeof id !== 'string' || !ObjectId.isValid(id)) {
      throw new Error('A valid form ID is required.');
    }
    if (!ownerPubkey || typeof ownerPubkey !== 'string') {
      throw new Error('A valid owner publicKey is required.');
    }

    // Connect to the database
    const db = await getDatabase();

    // Get the forms and formSubmissions collections from the database
    const formsCollection = db.collection<IForm>('forms');
    const formSubmissionsCollection =
      db.collection<IFormSubmission>('formSubmissions');

    // Retrieve the form matching the ID and owner publicKey
    const form = (await formsCollection.findOne({
      _id: new ObjectId(id),
      owner: ownerPubkey,
    })) as WithId<IForm> | null;

    if (!form) {
      // If no form is found, return null
      return null;
    }

    // Retrieve all submissions related to the form
    const submissions = await formSubmissionsCollection
      .find({
        form_id: id,
      })
      .toArray();

    // Return the form with _id as a string and the related submissions
    return {
      form: { ...form, _id: form._id.toString() },
      submissions,
    };
  } catch (error) {
    console.error('Error retrieving form and submissions:', error);
    return null;
  }
}
