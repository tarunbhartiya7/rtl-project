import { screen, render } from "@testing-library/react";
import RepositoriesSummary from "./RepositoriesSummary";

test("should display information about the repository", () => {
  const repository = {
    stargazers_count: 1212,
    open_issues: 10,
    forks: 3223,
    language: "JavaScript",
  };
  render(<RepositoriesSummary repository={repository} />);

  for (let key in repository) {
    const value = repository[key];
    const element = screen.getByText(new RegExp(value)); // create regular expression on the fly containing the text
    expect(element).toBeInTheDocument();
  }
});
