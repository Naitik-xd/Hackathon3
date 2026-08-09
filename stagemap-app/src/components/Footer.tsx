export default function Footer() {
  return (
    <footer className="w-full py-xl px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-lg bg-surface-container-lowest mb-20 md:mb-0 mt-auto">
      <div className="font-headline-sm text-headline-sm text-primary">
        StageMap ❤️
      </div>
      <div className="flex flex-wrap justify-center gap-lg">
        <a className="text-on-surface-variant opacity-80 hover:text-primary hover:underline font-body-sm text-body-sm" href="#">About</a>
        <a className="text-on-surface-variant opacity-80 hover:text-primary hover:underline font-body-sm text-body-sm" href="#">Guidelines</a>
        <a className="text-on-surface-variant opacity-80 hover:text-primary hover:underline font-body-sm text-body-sm" href="#">Support</a>
        <a className="text-on-surface-variant opacity-80 hover:text-primary hover:underline font-body-sm text-body-sm" href="#">Privacy</a>
      </div>
      <div className="font-body-sm text-body-sm text-on-surface-variant">
        StageMap © 2024. Made for India with ❤️
      </div>
    </footer>
  )
}
