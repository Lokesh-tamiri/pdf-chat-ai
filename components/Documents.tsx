import { adminDb } from "@/firebaseAdmin"; // Server-side Firestore instance
import PlaceholderDocument from "./PlaceholderDocument";
import { auth } from "@clerk/nextjs/server"; // Clerk authentication
import Document from "./Document";

async function Documents() {
  const { userId } = auth();

  try {
    // Authenticate the user and get their ID
    if (!userId) {
      throw new Error("User is not authenticated.");
    }

    // Fetch the user's Firestore document
    const userDoc = await adminDb.collection("users").doc(userId).get();

    if (!userDoc.exists) {
      console.warn(
        `User document not found for userId: ${userId}. Creating a new one.`
      );

      // Create a new user document with default data
      await adminDb.collection("users").doc(userId).set({
        createdAt: new Date().toISOString(),
        files: [], // Default empty files collection
      });

      return (
        <div className="p-5 bg-gray-100 rounded-sm max-w-7xl mx-auto text-center">
          <p className="text-gray-500 text-lg">
            No documents available. A new account has been initialized. Please
            upload some files.
          </p>
        </div>
      );
    }

    // If the document exists but has no data
    if (!userDoc.data()) {
      console.warn(
        `User document for userId: ${userId} has no data. Initializing default structure.`
      );
      await adminDb.collection("users").doc(userId).set({
        createdAt: new Date().toISOString(),
        files: [], // Default empty files collection
      });

      return (
        <div className="p-5 bg-gray-100 rounded-sm max-w-7xl mx-auto text-center">
          <p className="text-gray-500 text-lg">
            No data found in your account. Default structure has been created.
            Please upload some files.
          </p>
        </div>
      );
    }

    // Fetch the user's files sub-collection
    const filesSnapshot = await userDoc.ref.collection("files").get();

    if (filesSnapshot.empty) {
      console.warn("No files found in the user's collection.");
      return (
        <div className="p-5 bg-gray-100 rounded-sm max-w-7xl mx-auto text-center">
          <p className="text-gray-500 text-lg">
            No documents available. Please upload some files.
          </p>
        </div>
      );
    }

    // Map through the documents and render them
    return (
      <div className="flex flex-wrap p-5 bg-gray-100 justify-center lg:justify-start rounded-sm gap-5 max-w-7xl mx-auto">
        {filesSnapshot.docs.map((doc) => {
          const { name, downloadUrl, size } = doc.data();

          return (
            <Document
              key={doc.id}
              id={doc.id}
              name={name}
              size={size}
              downloadUrl={downloadUrl}
            />
          );
        })}
      </div>
    );
  } catch (error: any) {
    console.error("Error loading documents:", error.message);

    // Customize error messages for specific Firestore errors
    let errorMessage =
      "An error occurred while loading documents. Please try again later.";
    if (error.message.includes("5 NOT_FOUND")) {
      errorMessage =
        "The requested document or collection was not found in the database.";
    }

    return (
      <div className="p-5 bg-gray-100 rounded-sm max-w-7xl mx-auto text-center">
        <p className="text-red-500 text-lg">{errorMessage}</p>
        <pre>
          <code>{userId}</code>
        </pre>
        <p className="text-gray-500">{error.message}</p>
      </div>
    );
  }
}

export default Documents;
