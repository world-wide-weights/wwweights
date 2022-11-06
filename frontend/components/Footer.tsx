/**
 * Footer
 */
export const Footer = () => {
  return (
    <footer>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
          <div className="mb-5">
            <h4 className="text-2xl pb-4 font-extrabold">WWWeights</h4>
            <p className="font-light">
              Lorem Ipsum Tesxt...Lorem Ipsum Tesxt...Lorem Ipsum Tesxt...Lorem
              Ipsum Tesxt...Lorem Ipsum Tesxt...Lorem Ipsum
            </p>
          </div>
          <div className="mb-5">
            <h4 className="pb-4 font-bold">About</h4>
            <ul>
              <li>
                {" "}
                <a href="#" className=" hover:text-blue-500 font-light">
                  {" "}
                  About us
                </a>
              </li>
              <li>
                {" "}
                <a href="#" className="hover:text-blue-500 font-light">
                  {" "}
                  Privacy Policy
                </a>
              </li>
              <li>
                {" "}
                <a href="#" className="hover:text-blue-500 font-light">
                  {" "}
                  Newsletter
                </a>
              </li>
              <li>
                {" "}
                <a href="#" className="hover:text-blue-500 font-light">
                  {" "}
                  Link
                </a>
              </li>
              <li>
                {" "}
                <a href="#" className="hover:text-blue-500 font-light">
                  {" "}
                  Link
                </a>
              </li>
            </ul>
          </div>
          <div className="mb-5">
            <h4 className="pb-4 font-bold"> About</h4>
            <ul>
              <li>
                {" "}
                <a href="#" className="hover:text-blue-500 font-light">
                  {" "}
                  Link
                </a>
              </li>
              <li>
                {" "}
                <a href="#" className="hover:text-blue-500 font-light">
                  {" "}
                  Link
                </a>
              </li>
              <li>
                {" "}
                <a href="#" className="hover:text-blue-500 font-light">
                  {" "}
                  Link
                </a>
              </li>
              <li>
                {" "}
                <a href="#" className="hover:text-blue-500 font-light">
                  {" "}
                  Link
                </a>
              </li>
              <li>
                {" "}
                <a href="#" className="hover:text-blue-500 font-light">
                  {" "}
                  Link
                </a>
              </li>
            </ul>
          </div>
          <div className="mb-5">
            <h4 className="pb-4 font-bold">Useful Links</h4>
            <ul>
              <li>
                {" "}
                <a href="#" className="hover:text-blue-500 font-light">
                  {" "}
                  Link
                </a>
              </li>
              <li>
                {" "}
                <a href="#" className="hover:text-blue-500 font-light">
                  {" "}
                  Link
                </a>
              </li>
              <li>
                {" "}
                <a href="#" className="hover:text-blue-500 font-light">
                  {" "}
                  Link
                </a>
              </li>
              <li>
                {" "}
                <a href="#" className="hover:text-blue-500 font-light">
                  {" "}
                  Link
                </a>
              </li>
              <li>
                {" "}
                <a href="#" className="hover:text-blue-500 font-light">
                  {" "}
                  Link
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="py-1 bg-gray-200 text-center">
        <p className="text-center text-base text-gray-500">
          © WWWeights {new Date().getFullYear()} -<a href=""> Imprint</a>
        </p>
      </div>
    </footer>
  );
};
