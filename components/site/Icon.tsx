/**
 * The four UI icons exported from Figma (nodes 340:1466, 340:1478,
 * 340:1481, 340:1502). Path data is the exported vector verbatim; only the
 * hardcoded stroke colour is swapped for currentColor so one icon can sit on
 * the green hero and on white alike. Source files: public/icons/*.svg.
 */

type IconProps = { className?: string };

const strokeProps = {
  stroke: "currentColor",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  fill: "none",
};

export function ChevronDown({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <path d="M4 6L8 10L12 6" strokeWidth="1.33333" {...strokeProps} />
    </svg>
  );
}

export function Search({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <path d="M14.0001 14L11.1068 11.1067" strokeWidth="1.33333" {...strokeProps} />
      <path
        d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z"
        strokeWidth="1.33333"
        {...strokeProps}
      />
    </svg>
  );
}

export function Bag({ className }: IconProps) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <path
        d="M1.36654 1.36667L2.0992 1.348C2.25749 1.34401 2.41203 1.39649 2.53516 1.49604C2.65829 1.59559 2.74196 1.73572 2.7712 1.89133L4.56454 11.456C4.59316 11.6089 4.67433 11.7469 4.79401 11.8463C4.91368 11.9456 5.06433 12 5.21987 12H11.9999"
        strokeWidth="1.33333"
        {...strokeProps}
      />
      <path
        d="M3.04199 3.33333H13.9987C14.0979 3.33313 14.1959 3.35507 14.2855 3.39755C14.3751 3.44004 14.4542 3.50199 14.5168 3.57889C14.5795 3.6558 14.6242 3.74572 14.6477 3.8421C14.6712 3.93848 14.6729 4.03889 14.6527 4.136L13.9687 8.28667C13.9025 8.58765 13.734 8.8564 13.4921 9.04722C13.2501 9.23804 12.9494 9.33914 12.6413 9.33333H4.16666"
        strokeWidth="1.33333"
        {...strokeProps}
      />
      <path
        d="M12 14.6667C12.7364 14.6667 13.3333 14.0697 13.3333 13.3333C13.3333 12.597 12.7364 12 12 12C11.2636 12 10.6667 12.597 10.6667 13.3333C10.6667 14.0697 11.2636 14.6667 12 14.6667Z"
        strokeWidth="1.33333"
        {...strokeProps}
      />
      <path
        d="M5.33333 14.6667C6.06971 14.6667 6.66667 14.0697 6.66667 13.3333C6.66667 12.597 6.06971 12 5.33333 12C4.59695 12 4 12.597 4 13.3333C4 14.0697 4.59695 14.6667 5.33333 14.6667Z"
        strokeWidth="1.33333"
        {...strokeProps}
      />
    </svg>
  );
}

export function ArrowTurn({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
      <path d="M12.5 8.33333L16.6667 12.5L12.5 16.6667" strokeWidth="1.66667" {...strokeProps} />
      <path
        d="M3.33333 3.33333V9.16667C3.33333 10.0507 3.68452 10.8986 4.30964 11.5237C4.93477 12.1488 5.78261 12.5 6.66667 12.5H16.6667"
        strokeWidth="1.66667"
        {...strokeProps}
      />
    </svg>
  );
}
