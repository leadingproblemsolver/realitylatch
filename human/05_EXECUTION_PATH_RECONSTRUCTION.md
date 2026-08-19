# HUMAN GATE 5 — Reconstruction Test

Close the implementation chat before doing this.

Without opening source, sketch:

`input → validation → extraction → normalization → decision/gate → persistence → human handoff → authorization → side effect → persistence → independent verification → receipt`

Then answer:
- [ ] Where does the first durable write occur?
- [ ] Which component owns canonical truth?
- [ ] Where can a retry cause duplicate execution?
- [ ] What happens if the process crashes after the external side effect?
- [ ] What is the most dangerous illegal transition?
- [ ] Why do the current tests matter?
- [ ] What do they NOT prove?
- [ ] Which file/function would you modify to change one material invariant?

If you cannot answer these, do not advance to live execution.
