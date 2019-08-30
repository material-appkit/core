##Usage Notes

- When developing against this library via `npm link`, you will encounter
 ESLint errors due to the absence of **react** as a devDependency.
  To circumvent this issue you may link to the **react** library in your app.
  ex: `npm link /path/to/my/app/node_modules/react`
  
  See: https://reactjs.org/warnings/invalid-hook-call-warning.html#duplicate-react
  
