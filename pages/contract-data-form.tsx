import Link from "next/link";
import { fromJSON } from "postcss";
import { FormEvent, useState } from "react";
import styles from "../styles/Home.module.css";
import Header from "./header";

export default function ContractDataForm() {
  // Handle the submit event on form submit.
  const handleSubmit = async (event: FormEvent) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    // Cast the event target to an html form
    const form = event.target as HTMLFormElement;

    //Check if the Patent ID is correct.
    if (form.patent_id.value.match("[A-F]-[1-9]{5,7}/[A-Z]{5,9}") == null) {
      alert(
        "Please provide Patent ID in the format [A-F]-[1-9]{5,7}/[A-Z]{5,9}"
      );
      return;
    }

    // Get data from the form.
    const data = {
      researcher: form.researcher.value as string, //the name of the lead reasearcher
      university: form.university.value as string, //the name of their university
      patent_filed: {
        patent_id: form.patent_id.value as string, //must follow the pattern "[A-F]-[1-9]{5,7}\/[A-Z]{5,9}", e.g. A-12345/HAYFEVER
        institution: form.institution.value as string, //the name of the filing institution
      },
    };

    // Send the form data to our API and get a response.
    const response = await fetch("/api/form", {
      // Body of the request is the JSON data we created above.
      body: JSON.stringify(data),
      // Tell the server we're sending JSON.
      headers: {
        "Content-Type": "application/json",
      },
      // The method is POST because we are sending data.
      method: "POST",
    });

    // Get the response data from server as JSON.
    // If server returns the name submitted, that means the form works.
    const result = await response.json();
    alert(`Is this your full name: ${result.data}`);
  };
  return (
    <div className="container">
      <h1 className={styles.title}>
        Form <Link href="/">with</Link> JavaScript.
      </h1>

      <p className={styles.description}>
        Get started by looking at{" "}
        <code className={styles.code}>pages/js-form.js</code>
      </p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="researcher">Reseacher</label>
        <input
          type="text"
          id="researcher"
          name="researcher"
          className="mt-1
          block
          w-full
          rounded-md
          border-gray-300
          shadow-sm
          focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
        <label htmlFor="university">University</label>
        <input
          type="text"
          id="university"
          name="university"
          className="mt-1
          block
          w-full
          rounded-md
          border-gray-300
          shadow-sm
          focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
        <label htmlFor="patent_id" className="control-label">
          Patent ID
        </label>
        <input
          type="text"
          id="patent_id"
          name="patent_id"
          className="mt-1
          block
          w-full
          rounded-md
          border-gray-300
          shadow-sm
          focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
          form-control"
          required
          //onChange={handlePatentChange}
          //value={patentId}
        />
        <label htmlFor="institution">Institution</label>
        <input
          type="text"
          id="institution"
          name="institution"
          className="mt-1
          block
          w-full
          rounded-md
          border-gray-300
          shadow-sm
          focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
        <button
          type="submit"
          className="rounded-md shadow-sm w-full mt-1 bg-indigo-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
