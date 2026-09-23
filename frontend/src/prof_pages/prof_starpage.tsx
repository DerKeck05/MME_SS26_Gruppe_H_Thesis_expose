import { useState } from "react";



function ProfStartpage() {

const [showThesisModal, setShowThesisModal] = useState(false);


function assignThesis(){
    setShowThesisModal(true);
}

console.log(showThesisModal);
  return (
  <main>
    <div>
        <h1>Professor Dashboard</h1>
        <table>
            <thead>
                <tr>
                <th> Name</th>
                <th> E-Mail</th>
                <th>Kurs</th>
                <th>Thesis</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td> maaaa</td>
                    <td> jfdjjfej</td>
                    <td>fefffefe</td>
                    <td>
                        <button onClick={assignThesis}> 
                            Thesis Zuordnen 
                        </button>
                    </td>
                </tr>   
            </tbody>
        </table>
    </div>
  </main>
  );
}

export default ProfStartpage;