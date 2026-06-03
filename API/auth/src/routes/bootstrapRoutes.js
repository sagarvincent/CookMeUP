const { Router } = require('express');
const {
  RECIPES,
  INVENTORY,
  CUISINES,
  COURSES,
  DIETS,
  DIET_TARGETS,
  ASSISTANT_LINES,
} = require('../../seed/bootstrapData');

const router = Router();

// ----------------------- GET /data/bootstrap ---------------------------- START
// calls:     (none — returns static seed data)
// called by: Express router (public — no auth required)
//
// Single round-trip endpoint used by the frontend on app boot.
// Returns all seed/catalogue data so the frontend can cut its mock dependency.
// ----------------------- GET /data/bootstrap ---------------------------- END
router.get('/', (_req, res) => {
  res.json({
    recipes:        RECIPES,
    inventory:      INVENTORY,
    cuisines:       CUISINES,
    courses:        COURSES,
    diets:          DIETS,
    dietTargets:    DIET_TARGETS,
    assistantLines: ASSISTANT_LINES,
  });
});

module.exports = router;
