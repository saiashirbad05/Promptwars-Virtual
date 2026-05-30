import './TricolorBar.css';

export default function TricolorBar() {
  return (
    <div className="tricolor-bar" role="presentation" aria-hidden="true">
      <div className="tricolor-bar__saffron" />
      <div className="tricolor-bar__white" />
      <div className="tricolor-bar__green" />
    </div>
  );
}
