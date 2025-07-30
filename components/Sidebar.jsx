

import { getters } from '../store/app'
import '../node_modules/react-simple-tree-menu/dist/main.css';
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next';
import TreeMenu from 'react-simple-tree-menu';
import React, { useEffect, useState } from "react";
import {  Button } from "react-bootstrap";

function hasChildren(data, t) {
  data.forEach(item => {
    item.label = t(item.label)
    if (item.nodes.length > 0) {
      hasChildren(item.nodes, t)
    }
  })

  return data;
}
const Sidebar = (props) => {
  const { t } = useTranslation("common");
  const getAllMapsViews = getters.getAllLinkMenu();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleDrawer = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleEscKeyPress = (e) => {
      if (e.keyCode === 27 && isOpen) {
        setIsOpen(false);
      }
    };
    
    document.body.setAttribute("nonce", "abc123xyz");
    if (isOpen) {
      document.body.style.setProperty("overflow", "hidden");
    } else {
      document.body.style.removeProperty("overflow");
    }

    document.addEventListener("keydown", handleEscKeyPress);

    document.addEventListener("focusout", onfocus);
    onfocus = (e) => {

      const list = document.querySelector('#menuBar');
      if (list) {
        if (!list.contains(e.relatedTarget)) {
          setIsOpen(false);
        }
      }
    };
    return () => {
      document.removeEventListener("keydown", handleEscKeyPress);
      document.addEventListener("focusout", onfocus);
    };
  }, [props.content, isOpen]);

  return (
    <div id="menuBar">
      <Button className="bm-burger-button" variant='dark' size='sm'  onClick={handleDrawer}>
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" fill="currentColor" className="bi bi-list" viewBox="4 3 15 20">
          <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5" />
        </svg>
      </Button>
      {isOpen ? <>
        <div className="bm-menu-wrap bm-overlay" >
          <Button className="bm-menux bm-burger-button" size='sm'  variant='secondary' onClick={handleDrawer}>
            X
          </Button>
          <div className="bm-button-tree" >
            <TreeMenu data={hasChildren(getAllMapsViews, t)}

              onClickItem={({ key, label, ...props }) => {

                if (props.url) {
                  router.push(props.url);
                  //  setIsOpen(false);
                }
              }} >
            </TreeMenu>
            {props.children}
          </div>
        </div></> : null
      }
    </div>
  );
}

export default Sidebar;