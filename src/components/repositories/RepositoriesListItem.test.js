import { screen, render, act } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import RepositoriesListItem from "./RepositoriesListItem";

// module mocking is second best option
// jest.mock("../tree/FileIcon", () => {
//   return () => {
//     return "File Icon Component";
//   };
// });

function renderComponent() {
  const repository = {
    full_name: "facebook/react",
    language: "JavaScript",
    description: 3223,
    owner: {
      login: "facebook",
    },
    name: "react",
    html_url: "https://github.com/facebook/react",
  };
  render(
    <BrowserRouter>
      <RepositoriesListItem repository={repository} />
    </BrowserRouter>
  );

  return { repository };
}

test("should display link to github homepage for this repository", async () => {
  const { repository } = renderComponent();

  // Avoid using below technique, its a last option
  //   await act(async () => {
  //     await pause();
  //   });

  //   screen.debug();

  // preferred solution
  screen.findByRole("img", { name: "JavaScript" }); // solve act warning by finding any element which gets rendered asynchronously

  const link = screen.getByRole("link", { name: /github repository/i });

  expect(link).toHaveAttribute("href", repository.html_url);
});

// const pause = () => new Promise((resolve) => setTimeout(resolve, 100));

test("should show a file icon with appropriate icon", async () => {
  renderComponent();
  const icon = await screen.findByRole("img", { name: "JavaScript" });
  expect(icon).toHaveClass("js-icon");
});

test("should show a link to the code editor page", async () => {
  const { repository } = renderComponent();
  const link = await screen.findByRole("link", {
    name: new RegExp(repository.owner.login),
  });

  expect(link).toHaveAttribute("href", `/repositories/${repository.full_name}`);
});
