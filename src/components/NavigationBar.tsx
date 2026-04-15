import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { ShoppingCartDrawer } from './ShoppingCartDrawer'

export const NavigationBar = () => {
  const { user } = useAuth()

  return (
    <header className="sticky w-full top-0 z-50">
      <nav className="bg-white py-2.5">
        <div className="flex flex-wrap items-center justify-between max-w-7xl px-4 mx-auto">
          <Link to="/">
            <h1 className="text-xl text-slate-900 sm:text-2xl">
              Où est Médor ?
            </h1>
          </Link>

          <div className="flex items-center lg:order-2">
            {user ? (
              <Link
                to="/profile"
                className="text-dark-grey bg-yellow-150 hover:bg-yellow-150/80 focus:ring-4 focus:ring-yellow-150 font-medium rounded-lg text-sm px-4 lg:px-5 py-2 lg:py-2.5 sm:mr-2 lg:mr-0 "
              >

                <span>Mon profil</span>
              </Link>
            ) :
              <Link
                to="/login"
                className=""
              >
                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0 0a8.949 8.949 0 0 0 4.951-1.488A3.987 3.987 0 0 0 13 16h-2a3.987 3.987 0 0 0-3.951 3.512A8.948 8.948 0 0 0 12 21Zm3-11a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </Link>
            }
            <ShoppingCartDrawer />
            <button data-collapse-toggle="mobile-menu-2" type="button" className="inline-flex items-center p-2 ml-1 text-sm text-gray-500 rounded-lg lg:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 " aria-controls="mobile-menu-2" aria-expanded="false">
              <span className="sr-only">Open main menu</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd"></path></svg>
              <svg className="hidden w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
            </button>
          </div>

          <div className="items-center justify-between hidden w-full lg:flex lg:w-auto lg:order-1" id="mobile-menu-2">
            <ul className="flex flex-col mt-4 font-medium lg:flex-row lg:space-x-8 lg:mt-0">
              <li>
                <a href="#" className="block py-2 pl-3 pr-4 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-yellow-150 lg:p-0 ">Nos produits</a>
              </li>
              <li>
                <a href="#" className="block py-2 pl-3 pr-4 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-yellow-150 lg:p-0 ">Le concept</a>
              </li>
              <li>
                <a href="#" className="block py-2 pl-3 pr-4 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-yellow-150 lg:p-0 ">Notre histoire</a>
              </li>
              <li>
                <Link to="/contact" className="block py-2 pl-3 pr-4 text-gray-700 border-b border-gray-100 hover:bg-gray-50 lg:hover:bg-transparent lg:border-0 lg:hover:text-yellow-150 lg:p-0 ">
                  Nous contacter
                </Link>
              </li>
            </ul>
          </div>
        </div>

      </nav>
    </header>
  )
}