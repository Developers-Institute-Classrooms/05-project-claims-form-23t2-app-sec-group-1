import { render, screen } from "@testing-library/react";
import App from "./App";

describe("App", () => {
  test("The app renders", () => {
    render(<App />);
    expect(screen.getByText(/Insurance Claims Form/i)).toBeInTheDocument();
    expect(screen.getByLabelText("Policy Number")).toBeInTheDocument();
    expect(screen.getByLabelText("Customer Id")).toBeInTheDocument();
    expect(screen.getByLabelText("Condition Claimed For")).toBeInTheDocument();
    expect(screen.getByLabelText("Symptom Details")).toBeInTheDocument();
    expect(screen.getByLabelText("Medical Service Type")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Other Insurance Provider")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("I consent")).toBeInTheDocument();
    expect(
      screen.getByText(
        /As part of an insurance claim with enSURE, I consent and give authority to enSURE and any of its related entities and agents to collect, use and disclose, any medical, financial or other personal information about the life assured for the purposes of assessing and managing the insurance claim. I declare that all medical information pertaining to me and relevant to my insurance claim has been provided and disclosed to enSURE, and understand that making any false or fraudulent claim could result in cancellation of my policy and/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Policy Number" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Service Provider Name" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Medical Service Type" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Symptom Details" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Condition Claimed For" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("textbox", { name: "Customer Id" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("combobox", { name: "Other Insurance Provider" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("checkbox", { name: "I consent" })
    ).toBeInTheDocument();
    expect(screen.getByTestId("datePicker")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
