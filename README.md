##Usage Notes

- When developing against this library via `npm link`, you will encounter
 ESLint errors due to the absence of required peer dependencies (react, material-ui, etc).
 To circumvent this issue you may link to the **react** library in your app. For example:
  
  - `npm link /path/to/my/app/node_modules/react`  
  - `npm link /path/to/my/app/node_modules/@material-ui/core`
  - `npm link /path/to/my/app/node_modules/@material-ui/icons`
  
  See: https://reactjs.org/warnings/invalid-hook-call-warning.html#duplicate-react
  
