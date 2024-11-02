import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Layout from "./components/Layout.tsx";
import MainForm from "./components/MainForm.tsx";
import {ErrorBoundary} from "@/lib/ErrorBoundary.tsx";
import ErrorPage from "@/components/ErrorPage.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Layout>
      <ErrorBoundary fallback={<ErrorPage />}>
        <MainForm />
      </ErrorBoundary>
    </Layout>
  </React.StrictMode>
);
