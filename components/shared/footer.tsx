
export default function Footer() {
  return (
    

<footer className="mt-20 bottom-0 left-0 bg-background w-full p-4 border-t border-foreground/20 shadow md:flex md:items-center md:justify-between md:p-6 ">
    <span className="text-sm sm:text-center ">© 2024 <a href="/" className="hover:underline">File Drive™</a>. All Rights Reserved.
    </span>
    <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
        <li>
            <a href="#" className="hover:underline me-4 md:me-6">About</a>
        </li>
        <li>
            <a href="#" className="hover:underline me-4 md:me-6">Privacy Policy</a>
        </li>
        <li>
            <a href="#" className="hover:underline me-4 md:me-6">Licensing</a>
        </li>
        <li>
            <a href="#" className="hover:underline">Contact</a>
        </li>
    </ul>
</footer>

  )
}
