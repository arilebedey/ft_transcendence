import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-10 border-b bg-card/80 backdrop-blur-sm py-2">
      <div className="container mx-auto px-4 flex justify-end">
        <ThemeToggle />
      </div>
    </nav>
  );
}
