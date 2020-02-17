import React from "react";
import {Button} from "react-bootstrap"
import "./Home.css";

export default function Home() {
  return (
    <div className="Home">
      <br/>
      <div className="lander">
        <h1>Search, Summarize, and Save Time.</h1>
        <p>N*capsulate is a web-based application that enables smart searching through approximately 200,000 news articles.</p>
        <h1>How does it work?</h1>
        <p> Given a URL, the system saves the content and context of the link and retrieves such records. </p>
        <p> The content is parsed into (English) words, removing stop words. Words with explicit meaning, e.g. common nouns, are stored in the database. </p>
        <p> The user queries for URLs by entering a set of words. </p>
        <p> N*capsulate returns a list of relevant results, each containing a summary of the article.</p>
      </div>
      <br/>
      <Button href="/url" className="home-btn">Start Searching</Button>
    </div>
  );
}
