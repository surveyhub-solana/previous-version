export default function ThankYouForSubmission() {
  return (
    <div className="flex justify-center w-full h-full items-center p-8">
      <div className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background w-full p-8 overflow-y-auto border shadow-xl shadow-blue-700 rounded">
        <h1 className="text-2xl font-bold">Form submitted</h1>
        <p className="text-muted-foreground">
          Thank you for submitting the form, you can close this page now.
        </p>
      </div>
    </div>
  );
}
