# Dependency Updates - recipe_frontend

Date: 2025-12-11

Tooling/Framework:
- React app (Create React App toolchain via react-scripts 5)
- Node.js: 18.x (detected)
- Package manager: npm (package-lock.json)

Updated dependencies:
- react: ^18.2.0 -> ^18.3.1
- react-dom: ^18.2.0 -> ^18.3.1
- react-router-dom: ^6.30.2 (unchanged latest in 6.x line)
- Moved react-scripts to devDependencies (kept at ^5.0.1 for CRA compatibility with React 18)

Notes:
- Lockfile refreshed using `npm install` on Node 18.
- Build validated via `npm run build` and passed successfully.
- npm audit still reports issues inherited from CRA 5 dependency chain; forcing fixes would break CRA, so left as-is.
