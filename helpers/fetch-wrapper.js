
const fetchWrapper = {
    getTkn: async (url, accessTkn) => {
        const requestOptions = {
            method: 'GET',
            headers: {
                Authorization: "Bearer " + accessTkn,
                'Content-Type': 'application/json'
            },
        };
        return await fetch(url, requestOptions).then(handleResponse);
    }, postTkn: async (url, body, accessTkn) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                Authorization: "Bearer " + accessTkn,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        };
        return await fetch(url, requestOptions).then(handleResponse);
    },
    get: async (url) => {

        let requestOptions = {
            method: 'GET'
        };
        return await fetch(url, requestOptions).then(handleResponse);
    },
    post: async (url, body, headers) => {
        let requestOptions = {
            method: 'POST',
            headers: headers,
            body: body
        };
        return await fetch(url, requestOptions).then(handleResponse);
    },
    posServer: async (url, body, headers) => {
        let requestOptions = {
            method: 'POST',
            headers: headers,
            body: body
        };
        return await fetch(url, requestOptions);
    },
    postForm: async (url, body) => {
        const controller = new AbortController();
        const timeout = setTimeout(() => {
            controller.abort();
        }, 120000); // ⏰ Timeout en milisegundos (aquí: 60 segundos)

        let requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: body,
            signal: controller.signal
        };
        try {
            const response = await fetch(url, requestOptions);
            clearTimeout(timeout);
            if (!response.ok) {
                return response.text().then(text => {
                    const data = text && JSON.parse(text);
                    return data.data;
                });
            }
            const data = { status: 200, messaje: "ok" }
            return data;
        } catch (e) {
            clearTimeout(timeout);  // Asegura limpiar el timeout

            if (e.name === 'AbortError') {
                console.error("La solicitud fue cancelada por timeout.");
                return { status: 408, message: "Request Timeout", error: "La solicitud ha tardado demasiado en responder. Inténtalo de nuevo más tarde." };
            } else {
                console.error("Error en fetch:", e);
                return { status: 500, message: "INTERNAL SERVER ERROR", error: "Ocurrió un error interno en el servidor. Inténtalo de nuevo más tarde. " };
            }
        }
    },
    put: async (url, body) => {
        let requestOptions = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'STGB_ServiceName': 'OSB_SOA_GETRegexpPassword',
                'STGB_OperationName': 'getRexpPaaword',
                'STGB_Method': 'POST',
                'STGB_Version': '1'
            },
            body: JSON.stringify(body)
        };
        requestOptions.headers.append('Authorization', 'Basic' + base64.encode("StGeorge:StGeorgeB2022#"));
        return await fetch(url, requestOptions).then(handleResponse);
    },
    delete: async (url) => {
        let requestOptions = {
            method: 'DELETE'
        };
        return await fetch(url, requestOptions).then(handleResponse);
    },
    upload: async (url, data) => {
        let requestOptions = {
            method: 'POST',
            body: data
        };

        return await fetch(url, requestOptions).then(handleResponse);
    },
    downloadServerHeaders: async (url, body, headers, controller) => {
        let requestOptions = {
            method: 'POST',
            headers: headers,
            body: body,
            signal: controller.signal
        };
        return await fetch(url, requestOptions);
    },
    downloadServer: async (url, body) => {
        let requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: body
        };
        return await fetch(url, requestOptions);
    },
    download: async (url, filename) => {
        let requestOptions = {};
        return await fetch(url, requestOptions).then(function (t) {
            return t.blob().then((b) => {
                var a = document.createElement("a");
                a.href = URL.createObjectURL(b);
                a.setAttribute("download", filename);
                a.click();
            }
            );
        });
    },
    downloadZip: async (url, body) => {
        const controller = new AbortController();
        const timeout = setTimeout(() => {
            controller.abort();
        }, 120000); // ⏰ Timeout de 120 segundos

        let requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: body,
            signal: controller.signal
        };

        try {
            const response = await fetch(url, requestOptions);
            clearTimeout(timeout); // 🔹 Cancela el timeout si todo va bien

            if (!response.ok) {
                const text = await response.text();
                console.error("Error:", response.status, text);
                try {
                    const data = JSON.parse(text);
                    return data.data || data;
                } catch (e) {
                    return { status: response.status, message: "Unknown error" };
                }
            }

            const content = response.headers.get('content-disposition');
            if (!content) throw new Error('Missing content-disposition header');

            let filename = "archivo.zip"; // 🔹 Valor por defecto en caso de error al extraer el nombre
            const parts = content.split(';');
            if (parts.length > 1 && parts[1].includes("=")) {
                filename = parts[1].split('=')[1].replace(/"/g, ''); // 🔹 Extraer nombre del archivo correctamente
            }

            const reader = response.body.getReader();
            const stream = new ReadableStream({
                start(controller) {
                    function push() {
                        reader.read().then(({ done, value }) => {
                            if (done) {
                                controller.close();
                                return;
                            }
                            controller.enqueue(value);
                            push();
                        });
                    }
                    push();
                }
            });

            const newResponse = new Response(stream);
            const blob = await newResponse.blob();
            const urlBlob = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = urlBlob;
            a.setAttribute("download", filename);
            document.body.appendChild(a); // 🔹 Agregar al DOM para evitar problemas en algunos navegadores
            a.click();
            a.remove(); // 🔹 Remover después de la descarga
            return { status: 200, message: "ok" };

        } catch (error) {
            if (error.name === 'AbortError') {
                console.error("La solicitud fue cancelada por timeout.");
                return { status: 408, message: "Request Timeout", error: "The request took too long to respond. Please try again later." };
            } else {
                console.error("Error en fetch:", error);
                return { status: 500, message: "INTERNAL SERVER ERROR", error: "An internal server error occurred. Please try again later." };
            }
        }
    }

};

function handleResponse(response) {
    return response.text().then(text => {
        let data;
        try {
            data = text ? JSON.parse(text) : null;
        } catch (error) {
            console.error("No se pudo parsear la respuesta como JSON:", error);
            data = text;
        }

        if (!response.ok) {
            console.error("Error en la respuesta:", response.status, data);
            return {
                status: response.status,
                message: data.message,
                error: data.error
            };
        }
        if(!data) {
            return { status: 200, message: "ok" };
        }
        return data;
    });
}

export default fetchWrapper;