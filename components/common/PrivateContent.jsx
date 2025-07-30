import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation } from 'react-i18next';
import "react-datepicker/dist/react-datepicker.css";
import swal from 'sweetalert2/dist/sweetalert2.min.js';
import { useRouter } from "next/router";
import { io } from "socket.io-client";
import { useSession } from 'next-auth/react';
import datasource from '../../services/datasource';

const PrivateContent = ({ children }) => {
  const [showMain, setShowMain] = useState("n");
  const router = useRouter();
  const { t, lang } = useTranslation();
  const { data: session } = useSession();


  const validPage = async (url) => {
    if (url) {
      if (session) {
        window.localStorage.setItem("demo", "")
        setShowMain("y");
        document.body.style.overflow = "auto";

      } else {
        setShowMain("n");
        document.body.style.overflow = "hidden";

      }
    }
  };
  const notificationDeploiment = async () => {
    await fetch('/api/socket');
    if (!session?.user?.email) return;
    console.log("notificationDeploiment email", session.user.email);
    const socket = io({
      query: { email: session.user.email } // 🔐 El nombre del usuario como room
    });

    socket.on("connect", () => {
      console.log("WebSocket conectado correctamente.");
    });
    socket.on("notification", (data) => {
      console.log("-------  data---------:", data);
      if (data.type === "NOTIFICATION") {
        swal.fire({
          title: "DownLoad zip",
          text: data.message,
          icon: "success",
          buttons: true,
          showCancelButton: true
        }).then(async (willChange) => {
          if (willChange.isConfirmed) {
            if (data.id) {
              console.log("data id to:", data.id);
              let generateDocument = await datasource.downLoadFileZip(data.id);
              console.log("generateDocument:", generateDocument);
              if (generateDocument.status === 200) {
                swal.fire({
                  title: t('common:alertBinaryTitle'),
                  text: t('common:toolButon'),
                  icon: "success",
                  timer: 2500,
                  buttons: false,
                });
              } else {
                swal.fire({
                  title: generateDocument.error,
                  text: generateDocument.message,
                  icon: "error",
                }).then(() => {
                });
              }
            }
          }
        });
      } else if (data.type === "WARNNING") {
        swal.fire({
          title: "Warning",
          text: data.message,
          icon: "warning",
          dangerMode: true,
          showCancelButton: false
        });

      } else if (data.type === "USER_MESSAGE") {
        swal.fire({
          title: data.title,
          html: data.message,
          icon: "success",
          dangerMode: true,
          showCancelButton: false,
          confirmButtonText: "Ok"
        }).then(() => {
          if (data.url) {
            router.push(data.url);
          }
        });

      } else {
        swal.fire({
          title: "INTERNAL SERVER ERROR",
          text: data.message,
          icon: "error",
          dangerMode: true,
          showCancelButton: false
        });
      }
    });

    socket.on("disconnect", () => {
      console.log("WebSocket desconectado.");
    });

  };

  const reloadData = async () => {
    await notificationDeploiment()
    validPage(router.pathname);
  }
  useEffect(() => {
    reloadData();
    const handleRouteChange = url => {
      validPage(router.pathname);
    }
    router.events.on('routeChangeStart', handleRouteChange)
    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    }
  }, [session]);
  return (
    <>  {(showMain === "n") && (
      // App.jsx o componente de portada
      <div style={{
        display: "flex",
        backgroundColor: "#003B75",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        height: "100vh",
        maxHeight: "100vh"
      }}>
        <img
          src="/portada.png"
          alt="Generate Service"
          style={{
            maxWidth: "100%",
            maxHeight: "100%",
            objectFit: "contain",

          }}
        />
      </div>



    )
    }
      {(showMain === "y") &&
        (<div>
          {children}
        </div>)
      }
    </>
  );
};

export default PrivateContent;