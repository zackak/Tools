# ModelAudit Integration Instructions

This file documents the integration of the ModelAudit tool (https://github.com/promptfoo/modelaudit) into the Fortify project.

## 1. Install ModelAudit

ModelAudit is a Python CLI tool. To install it, run:

    pip install modelaudit[all]

You may want to use a virtual environment for isolation.

## 2. Usage

You can scan a model file or directory with:

    modelaudit <path-to-model-file-or-directory>

Example:

    modelaudit model.pkl

For JSON output (for UI integration):

    modelaudit model.pkl --format json --output results.json

## 3. Integration Plan

- The backend will expose an API endpoint to run ModelAudit on uploaded/selected files.
- The frontend will have a new page/component named "ModelAudit" matching the Fortify design.
- Scan results will be displayed in the UI, styled like the rest of the app.

## 4. References
- [ModelAudit GitHub](https://github.com/promptfoo/modelaudit)
- [ModelAudit Docs](https://www.promptfoo.dev/docs/model-audit/)

---

This file will be updated as integration progresses.