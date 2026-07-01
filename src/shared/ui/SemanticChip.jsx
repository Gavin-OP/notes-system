import { isChipVariant } from "../lib/semanticChipUtils";

function SemanticChip({ variant = "slate", className = "", children, ...rest }) {
  const resolvedVariant = isChipVariant(variant) ? variant : "slate";
  const classes = ["ns-chip", `ns-chip--${resolvedVariant}`, className].filter(Boolean).join(" ");

  return (
    <span className={classes} {...rest}>
      {children}
    </span>
  );
}

export default SemanticChip;
