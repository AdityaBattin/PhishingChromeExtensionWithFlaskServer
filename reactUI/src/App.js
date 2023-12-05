import React from 'react';
import "./index.css";
import { AiOutlineScan } from 'react-icons/ai';

import Scanpage from './components/Scanpage';
import History from './components/History';
import CurrentURL from './components/CurrentURL';
import { Tabs, Tab } from './components/Tabs';


const App = () => {
  
  return (
    <div className='flex flex-col w-[500px] h-[1000px]'>
      <nav className="bg-white dark:bg-gray-800 shadow py-4 border-b-2">
        <div className="px-8 mx-auto max-w-7xl">
            <div className="flex items-center justify-between px-3 h-10">
              <div className='flex items-center'>
                  <div className="flex items-center bg-white rounded-full p-1">
                    <a className="flex-shrink-0" href="/">
                        <img className="w-10 h-10" src="../public/icon.png" alt="watch dog icon"/>
                    </a>
                </div>
                {/* <div className='text-xl text-white'>Watchdog</div> */}
             </div>
              <div className="">
                  <button className="flex-shrink-0 flex justify-center items-center text-xl gap-2 px-4 py-2 font-semibold text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-purple-200">
                    <AiOutlineScan size={28} />
                    Scan Page
                  </button>
              </div>
            </div>
          </div>
      </nav>
      <div className='flex-1 text-white dark:bg-gray-800 '>
        <Tabs>
        <Tab label="Current-URL">
          <div className="py-3 px-3">
            <CurrentURL />
          </div>
        </Tab>
        <Tab label="Scan-Page">
          <div className="py-3 px-3">
            <Scanpage />
          </div>
        </Tab>
        <Tab label="History">
          <div className="py-3 px-3">
            <History />
          </div>
        </Tab>
      </Tabs>
      </div>
    </div>
  )
}

export default App
