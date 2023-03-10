import React, {useEffect, useState} from "react";

const chunkSize = 5000;

function UploadFiles() {
    const [file1, setFile1] = useState(null);
    const [file2, setFile2] = useState(null);
    const [typeJar, setTypeJar] = useState("classes");
    const [counter, setCounter] = useState(1)
    const [fileToBeUpload, setFileToBeUpload] = useState({})
    const [beginingOfTheChunk, setBeginingOfTheChunk] = useState(0)
    const [endOfTheChunk, setEndOfTheChunk] = useState(chunkSize)
    const [progress, setProgress] = useState(0)
    const [fileSize, setFileSize] = useState(0)
    const [chunkCount, setChunkCount] = useState(0)


    const resetChunkProperties = () => {
        setProgress(0)
        setCounter(1)
        setBeginingOfTheChunk(0)
        setEndOfTheChunk(chunkSize)
    }

    const getFile1 = (e) => {
        setFile1(e.target.files[0]);
    }
    const getFile2 = (e) => {
        setFile2(e.target.files[0]);
    }

    const getFileContext = (_file) => {
        resetChunkProperties();
        setFileSize(_file.size)
        const _totalCount = _file.size % chunkSize == 0 ? _file.size / chunkSize : Math.floor(_file.size / chunkSize) + 1; // Total count of chunks will have been upload to finish the file
        setChunkCount(_totalCount)
        setFileToBeUpload(_file)
    }

    const uploadChunk = async (chunk) => {
        try {
            const response = await fetch("http://localhost:8080/post/" + typeJar,
                {
                    method: 'post',
                    body: chunk,
                    headers: { 'Content-Type': 'application/json' }
                })
            const data = response.data;
            if (response.ok) {
                setBeginingOfTheChunk(endOfTheChunk);
                setEndOfTheChunk(endOfTheChunk + chunkSize);
                if (counter === chunkCount) {
                    if(typeJar === "classes"){
                        setTypeJar("sources");
                        setFileToBeUpload(file2);
                        getFileContext(file2);
                    }
                    else{
                        await uploadCompleted();
                    }
                    //console.log('Process is complete, counter', counter)
                    //await uploadCompleted();
                } else {
                    let percentage = (counter / chunkCount) * 100;
                    setProgress(percentage);
                }
            } else {
                console.log('Error Occurred:', data.errorMessage)
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    const uploadCompleted = async () => {
        setFileToBeUpload(null);
        const response = await fetch("http://localhost:8080/class/UploadComplete", {
            method: 'post'
        });
        if (response.ok) {
            setProgress(100);
            setTimeout(() => {  window.location.reload() }, 0);
        }
    }

    useEffect(() => {
        if (fileToBeUpload != null && fileSize > 0) {
            setCounter(counter + 1);
            if (counter <= chunkCount) {
                let chunk = fileToBeUpload.slice(beginingOfTheChunk, endOfTheChunk);
                uploadChunk(chunk);
            }
        }
    }, [fileToBeUpload, progress])


    const onFileUpload = () => {
        setTypeJar("classes");
        getFileContext(file1);
    };

    function DisplayUpload() {
        if (progress === 0) {
            if(file1 == null || file2 == null){
                return <div>
                    <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center opacity-50 cursor-not-allowed">
                        <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                            <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/>
                        </svg>
                        <span>Upload</span>
                    </button>
                </div>;
            }
            return <div>
                <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
                        onClick={onFileUpload}>
                    <svg className="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z"/>
                    </svg>
                    <span>Upload</span>
                </button>
            </div>;
        }

        return <div className="w-6/12 bg-gray-200 rounded-full">
            <div className="bg-red-600 text-xs font-medium text-red-100 text-center p-0.5 leading-none rounded-l-full"
                 style={{ width: Math.floor(progress) + "%" }}>
                Loading {typeJar}... {Math.floor(progress)}%
            </div>
        </div>;

    }

    return (
        <div>
            <div className="container mx-auto p-12 bg-gray-100 rounded-xl mb-8 px-4 py-4">

                <input
                    className="block w-6/12 text-sm text-gray-900 border border-gray-300 cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    aria-describedby="file_input_help" id="file_input" type="file" onChange={getFile1}/>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">JAR.</p>


                <input
                    className="block w-6/12 text-sm text-gray-900 border border-gray-300 cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                    aria-describedby="file_input_help" id="file_input" type="file" onChange={getFile2} />
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">JAR.</p>

                <DisplayUpload />

            </div>
        </div>

    );
}

export default UploadFiles;