const express = require("express");
const router = express.Router();

const {
  newContactValidation,
  updateContactValidation,
} = require("../../schemas/contacts");

const { validationCheck, tryCatchWrapper } = require("../../middlewares/index");

const {
  getContacts,
  getContact,
  createContact,
  deleteContact,
  updateContact,
} = require("../../controllers/contactsControllers");

router.get("/", tryCatchWrapper(getContacts));

router.get("/:id", tryCatchWrapper(getContact));

router.post(
  "/",
  validationCheck(newContactValidation),
  tryCatchWrapper(createContact)
);

router.delete("/:id", tryCatchWrapper(deleteContact));

router.put(
  "/:id",
  validationCheck(updateContactValidation),
  tryCatchWrapper(updateContact)
);

module.exports = router;
