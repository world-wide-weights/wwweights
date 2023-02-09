import { routes } from "../../services/routes/routes"
import { Button } from "../Button/Button"

/**
 * Footer
 */
export const Footer: React.FC = () => {
  return (
    <footer>
      <div className="bg-white text-center py-5">
        <div className="container flex flex-col items-center md:flex-row md:justify-between">
          {/* Copyright */}
          <div className="text-gray-600 pb-5 md:pb-0">
            World Wide Weights Copyright © {new Date().getFullYear()}
          </div>

          {/* Links */}
          <ul className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
            <li><Button to={routes.misc.contact} kind="tertiary">Contact</Button></li>
            <li><Button to={routes.misc.privacy} kind="tertiary">Privacy Policy</Button></li>
            <li><Button to={routes.misc.terms} kind="tertiary">Terms and Conditions</Button></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
