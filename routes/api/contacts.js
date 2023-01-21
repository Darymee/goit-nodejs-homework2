const express = require("express");
const router = express.Router();

const {
  newContactValidation,
  updateContactValidation,
  updateStatusContactValidation,
} = require("../../schemas/contacts");

const {
  validationCheck,
  tryCatchWrapper,
  tokenValidation,
} = require("../../middlewares/index");

const {
  getContacts,
  getContact,
  createContact,
  deleteContact,
  updateContact,
  updateStatusContact,
} = require("../../controllers/contactsControllers");

router.get("/", tryCatchWrapper(tokenValidation), tryCatchWrapper(getContacts));

router.get(
  "/:id",
  tryCatchWrapper(tokenValidation),
  tryCatchWrapper(getContact)
);

router.post(
  "/",
  tryCatchWrapper(tokenValidation),
  validationCheck(newContactValidation),
  tryCatchWrapper(createContact)
);

router.delete(
  "/:id",
  tryCatchWrapper(tokenValidation),
  tryCatchWrapper(deleteContact)
);

router.put(
  "/:id",
  tryCatchWrapper(tokenValidation),
  validationCheck(updateContactValidation),
  tryCatchWrapper(updateContact)
);
router.patch(
  "/:id/favorite",
  tryCatchWrapper(tokenValidation),
  validationCheck(updateStatusContactValidation),
  tryCatchWrapper(updateStatusContact)
);

module.exports = router;
