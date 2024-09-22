import React, { useState, useEffect } from 'react';
import './ConsumerKhata.css';

const ConsumerKhata = () => {

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Pad single digit months with a leading 0
    const day = String(today.getDate()).padStart(2, '0'); // Pad single digit days with a leading 0
    return `${year}-${month}-${day}`; // Format must be YYYY-MM-DD
  };

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [consumerData, setConsumerData] = useState({
    date: getTodayDate(),
    consumerName: '',
    baqaya: '', // Initialize as a number
  });
  const [wasooliData, setWasooliData] = useState({
    date: getTodayDate(),
    wasooli: '',
  });

  const [errorMessages, setErrorMessages] = useState({
    date: '',
    consumerName: '',
    baqaya: '',
  });
  const [isDataSaved, setIsDataSaved] = useState(false);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [isAddBaqayaVisible, setIsAddBaqayaVisible] = useState(false);
  const [baqayaToAdd, setBaqayaToAdd] = useState('');
  const [baqayaError, setBaqayaError] = useState('');
  const [consumers, setConsumers] = useState([]);
  const [selectedConsumerId, setSelectedConsumerId] = useState(null);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isAddConsumerConfirmVisible, setIsAddConsumerConfirmVisible] = useState(false);
  const [monthVisibility, setMonthVisibility] = useState({})
  const [isWasooliVisible, setIsWasooliVisible] = useState(false);
  const [currentManaging, setCurrentManaging] = useState(null);
  // Update this state to also include the wasooliId
  const [monthYearButtonsVisibility, setMonthYearButtonsVisibility] = useState({});
  const [language, setLanguage] = useState('English');
  const [deleteConfirmationData, setDeleteConfirmationData] = useState({
    consumerId: null,
    wasooliId: null, // Add this line
    index: null,
  });
  const [editingTransaction, setEditingTransaction] = useState(null);

  const [wasooliErrorMessages, setWasooliErrorMessages] = useState({
    date: '',
    wasooli: '',
  });

  const translations = {
    English: {
      consumerKhata: "Consumer Khata",
      addConsumer: "Add Consumer",
      date: "Date",
      consumerName: "Consumer Name",
      baqaya: "Baqaya",
      save: "Save",
      update: "Update",
      manage: "Manage",
      addBaqaya: "Add Baqaya",
      showAll: "Show All",
      hideAll: "Hide All",
      wasooli: "Wasooli",
      saveWasooli: "Save Wasooli",
      delete: "Delete",
      Khata: "Khata",
      confirmAddConsumer: "Are you sure you want to add a new consumer?",
      yes: "Yes",
      no: "No",
      deleteWasooliConfirm: "Are you sure you want to delete this Wasooli?",
      close: "Close",
      Show: "Show",
      Hide: "Hide",
      datee: "Please enter a date",
      consumerNamee: "Please enter consumer name",
      baqayaa: "Please enter baqaya amount",
      baqayaNumberr: "Baqaya must be a number",
      wasooliAmountt: "Please fill up the Wasooli amount",
      baqayaerror: "Please fill up the baqaya amount",
      wasooliDatee: "Date is required"
    },
    Urdu: {
      consumerKhata: "صارف خاتہ ",
      addConsumer: "صارف شامل کریں",
      date: "تاریخ",
      consumerName: "صارف کا نام",
      baqaya: "باقیہ",
      save: "محفوظ کریں",
      update: "اپ ڈیٹ",
      manage: "انتظام کریں",
      addBaqaya: "باقیہ شامل کریں",
      showAll: "سب دکھائیں",
      hideAll: "پوشیدہ کریں",
      wasooli: "وصولی",
      saveWasooli: "وصولی محفوظ کریں",
      delete: "حذف کریں",
      confirmAddConsumer: "کیا آپ واقعی نیا صارف شامل کرنا چاہتے ہیں؟",
      yes: "جی ہاں",
      no: "نہیں",
      Khata: "خاتہ",
      Show: "دکھائیں",
      Hide: "چھپائیں",
      deleteWasooliConfirm: "کیا آپ واقعی اس وصولی کو حذف کرنا چاہتے ہیں؟",
      close: "بند کریں",
      datee: "براہ کرم تاریخ درج کریں",
      consumerNamee: "براہ کرم صارف کا نام درج کریں",
      baqayaa: "براہ کرم باقیہ مقدار درج کریں",
      baqayaNumberr: "باقیہ کو نمبر ہونا چاہئے",
      wasooliAmountt: "براہ کرم وصولی کی رقم بھریں",
      wasooliDatee: "تاریخ ضروری ہے",
      baqayaerror: "برائے مہربانی باقیہ رقم بھریں",
    }

  };
  const monthTranslations = {
    January: "جنوری",
    February: "فروری",
    March: "مارچ",
    April: "اپریل",
    May: "مئی",
    June: "جون",
    July: "جولائی",
    August: "اگست",
    September: "ستمبر",
    October: "اکتوبر",
    November: "نومبر",
    December: "دسمبر",
  };

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3001/consumerkhata');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const consumersData = await response.json();

      // Process the data if necessary and update the state
      // For each consumer, fetch their Wasooli transactions and update the state accordingly
      const updatedConsumersData = await Promise.all(consumersData.map(async (consumer) => {
        const wasooliResponse = await fetch(`http://localhost:3001/wasooli/${consumer.idconsumerkhata}`);
        if (!wasooliResponse.ok) {
          console.log(`Failed to fetch wasooli data for consumer ID: ${consumer.idconsumerkhata}`);
          return consumer; // Return the consumer without wasooli data if fetch fails
        }
        const wasooliData = await wasooliResponse.json();
        return { ...consumer, wasooliTransactions: wasooliData };
      }));

      // Update state with the processed and fetched data
      setConsumers(updatedConsumersData);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

 
  useEffect(() => {
    fetchData();
  }, []);


  const CustomModal = ({ message, onClose }) => {
    return (
      <div className="custom-modal-overlay">
        <div className="custom-modal">
          <div className="custom-modal-content">
            <p>{message}</p>
            <button onClick={onClose}>close</button>
          </div>
        </div>
      </div>
    );
  };

  const toggleMonthYearButtonsVisibility = (consumerId) => {

    setMonthYearButtonsVisibility(prevState => {
      const newState = {
        ...prevState,
        [consumerId]: !prevState[consumerId],
      };

      return newState;
    });
  };


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // If the input is for baqaya, ensure it's handled as a number
    if (name === 'baqaya') {
      newValue = value !== '' ? parseInt(value, 10) : 0;
      if (isNaN(newValue)) {
        setErrorMessages((prevErrors) => ({
          ...prevErrors,
          baqaya: 'Baqaya must be a number',
        }));
        return; // Don't set the consumer data if the input is not a number
      }
    }

    setConsumerData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));

    // Clear any error messages for this input
    setErrorMessages((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const handleSaveClick = async () => {
    const { date, consumerName, baqaya, idconsumerkhata } = consumerData;
    let errors = {};

    if (!date || !consumerName || !baqaya) {
      errors = {
        ...!date && { date: "Please enter a date" },
        ...!consumerName && { consumerName: "Please enter consumer name" },
        ...!baqaya && { baqaya: "Please enter baqaya amount" },
      };
      setErrorMessages(errors);
      return;
    }

    const endpoint = idconsumerkhata ? `http://localhost:3001/consumerkhata/${idconsumerkhata}` : 'http://localhost:3001/consumerkhata';
    const method = idconsumerkhata ? 'PUT' : 'POST';

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          Date: date,
          name: consumerName,
          baqaya: parseInt(baqaya),
        }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      await fetchData();
      resetForm();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const resetForm = () => {
    setConsumerData({
      date: '',
      consumerName: '',
      baqaya: '',
    });
    setIsFormVisible(false);
    setErrorMessages({});
  };


  const handleCancelClick = () => {
    setIsFormVisible(false);
    setIsUpdateMode(false);
  };

  const handleUpdateClick = (id) => {
    const consumerToUpdate = consumers.find(consumer => consumer.idconsumerkhata === id);
    if (consumerToUpdate) {
      setConsumerData({
        date: consumerToUpdate.Date || '',
        consumerName: consumerToUpdate.name || '',
        baqaya: consumerToUpdate.baqaya || '',
        idconsumerkhata: consumerToUpdate.idconsumerkhata, // Store the id in the state
      });
      setIsUpdateMode(true);
      setIsFormVisible(true);
    } else {
      console.error("No consumer found with ID:", id);
    }
  };


  const handleAddBaqayaClick = () => {
    setIsAddBaqayaVisible(true);
  };

  const handleBaqayaInputChange = (e) => {
    const { value } = e.target;
    setBaqayaToAdd(value);
    setBaqayaError('');
  };

  const handleSaveBaqayaClick = async () => {
    if (!baqayaToAdd) {
      setBaqayaError('Please fill the Baqaya field');
      return;
    }
    const newBaqayaAmount = parseInt(baqayaToAdd);
    if (isNaN(newBaqayaAmount)) {
      setBaqayaError('Invalid Baqaya amount');
      return;
    }

    // Find the consumer to update
    const consumerToUpdate = consumers.find(consumer => consumer.idconsumerkhata === selectedConsumerId);
    if (!consumerToUpdate) {
      console.error("Consumer not found");
      return;
    }

    // Ensure consumerToUpdate.baqaya is a number
    const currentBaqaya = parseInt(consumerToUpdate.baqaya) || 0;

    // Calculate updated baqaya
    const updatedBaqaya = currentBaqaya + newBaqayaAmount;

    // Send the update request to the server
    try {
      const response = await fetch(`http://localhost:3001/consumerkhata/${selectedConsumerId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...consumerToUpdate,
          baqaya: updatedBaqaya, // Update with the calculated baqaya
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Update the local state to reflect the change
      const updatedConsumers = consumers.map(consumer =>
        consumer.idconsumerkhata === selectedConsumerId ? {
          ...consumer,
          baqaya: updatedBaqaya.toString(),
        } : consumer
      );

      setConsumers(updatedConsumers);

      setIsDataSaved(true);
      setBaqayaToAdd('');
      setIsAddBaqayaVisible(false);
      setBaqayaError('');

      // Optionally, refresh the data from the server to ensure UI consistency
      fetchData();
    } catch (error) {
      console.error('Error updating baqaya:', error);
      setBaqayaError('Failed to update baqaya');
    }
  };

  const toggleMonthVisibility = (consumerId, monthYear) => {
    setMonthVisibility(prevVisibility => ({
      ...prevVisibility,
      [consumerId]: {
        ...prevVisibility[consumerId],
        [monthYear]: !(prevVisibility[consumerId]?.[monthYear] ?? false),
      },
    }));
  };
  // Adjust handleSaveClick or create a new function to send the updated consumer data to the server
  // This involves crafting a PUT request with the consumer's updated data


  const ConfirmAddModal = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
      <div className="confirm-modal-overlay">
        <div className="confirm-modal">
          <p> {translations[language].confirmAddConsumer}</p>
          {/* Check these class names match your CSS */}
          <button className="confirm-modal-button confirm-modal-button-yes" onClick={onConfirm}> {translations[language].yes}</button>
          <button className="confirm-modal-button confirm-modal-button-no" onClick={onCancel}> {translations[language].no}</button>
        </div>
      </div>
    );
  };


  const handleAddConsumerClick = () => {
    setIsAddConsumerConfirmVisible(true);
  };

  const handleUpdateWasooliClick = (consumerId, transactionId) => {
    if (!consumerId || !transactionId) {
      console.error('Missing consumer ID or transaction ID');
      return;
    }

    const consumer = consumers.find(consumer => consumer.idconsumerkhata === consumerId);
    if (!consumer) {
      console.error('Consumer not found for ID:', consumerId);
      setIsAlertVisible(true);
      setAlertMessage("Error: Consumer not found");
      return;
    }
    console.log("Consumer found:", consumer.name);

    if (!consumer.wasooliTransactions || consumer.wasooliTransactions.length === 0) {
      console.error('No transactions found for consumer:', consumer.name);
      return;
    }

    console.log("Consumer's Wasooli Transactions:", consumer.wasooliTransactions);

    const selectedWasooliCard = consumer.wasooliTransactions.find(txn => txn.idwasooli.toString() === transactionId.toString());
    if (!selectedWasooliCard) {
      console.error('Wasooli transaction not found for ID:', transactionId, "in consumer:", consumer.name);
      return;
    }
    console.log("Selected Wasooli Card:", selectedWasooliCard);

    // Update the form data and editing transaction state asynchronously
    setWasooliData({
      date: selectedWasooliCard.date,
      wasooli: selectedWasooliCard.Wasooli.toString(),
    });

    setEditingTransaction({
      consumerId: consumerId,
      transactionId: transactionId,
    });

    setIsWasooliVisible(true);
  };


  const handleManageClick = (consumerId) => {
    setSelectedConsumerId(consumerId);
    setIsWasooliVisible(true);
    setCurrentManaging(consumerId); // Reset Wasooli form data
    setWasooliData({ date: '', Wasooli: '' });
  };

  const handleWasooliInputChange = (e) => {
    const { name, value } = e.target;
    setWasooliData(prevState => ({
      ...prevState,
      [name]: value // Ensure this never sets `date` or `wasooli` to undefined
    }));
  };

  const handleConfirmDeletion = async () => {
    const { consumerId, wasooliId, index } = deleteConfirmationData;

    if (!wasooliId) {
      console.error("Wasooli ID is missing.");
      return;
    }

    try {
      // Delete the Wasooli transaction
      const deleteResponse = await fetch(`http://localhost:3001/wasooli/${wasooliId}`, { method: 'DELETE' });

      if (!deleteResponse.ok) {
        const errorData = await deleteResponse.json();
        throw new Error(errorData.message || 'Failed to delete Wasooli transaction.');
      }

      console.log("Wasooli transaction deleted successfully.");

      // Re-fetch updated consumer data to refresh local state
      await fetchData();

      console.log("Consumer data refreshed after Wasooli deletion.");

      // Reset the delete confirmation data and close the modal
      setDeleteConfirmationData({ consumerId: null, wasooliId: null, index: null });
      setIsConfirmModalVisible(false);
    } catch (error) {
      console.error('Error during Wasooli deletion:', error);
    }
  };



  const handleCancelDeletion = () => {
    setIsConfirmModalVisible(false); // Hide the modal
  };

  const handleDeleteWasooliClick = (consumerId, wasooliId, index) => {
    // Log the parameters to ensure they are being passed correctly
    console.log(`Preparing to delete Wasooli with ID: ${wasooliId}, for Consumer ID: ${consumerId}, at Index: ${index}`);


    // Set the deleteConfirmationData with the correct values
    setDeleteConfirmationData({ consumerId, wasooliId, index });
    setIsConfirmModalVisible(true);
  };



  const AlertModal = ({ isOpen, message, onClose }) => {
    if (!isOpen) return null;

    return (
      <div className="alert-modal-overlay">
        <div className="alert-modal">
          <p>{message}</p>
          <button onClick={onClose}>OK</button>
        </div>
      </div>
    );
  };

  const ConfirmationModal = ({ onConfirm, onCancel }) => {
    return (
      <div className="confirmation-modal-overlay">
        <div className="confirmation-modal">
          <p> {translations[language].deleteWasooliConfirm}</p>
          <button className="yes-button" onClick={onConfirm}> {translations[language].yes}</button>
          <button className="no-button" onClick={onCancel}> {translations[language].no}</button>
        </div>
      </div>
    );
  };

  const handleSaveWasooliClick = async () => {
    try {
      const wasooliAmount = parseInt(wasooliData.wasooli);

      if (wasooliAmount <= 0) {
        throw new Error("invalid Wasooli amount");
      }

      if (isNaN(wasooliAmount) ) {
        throw new Error("Please fill up the Wasooli amount");
      }

      if (!wasooliData.date) {
        throw new Error("Date is required");
      }

      let payload = {
        date: wasooliData.date,
        Wasooli: wasooliAmount,
      };

      let endpoint = 'http://localhost:3001/wasooli';
      let method = 'POST';

      // If we're editing an existing transaction, adjust the endpoint and method.
      // Otherwise, ensure the consumer ID is included in the payload for new transactions.
      if (editingTransaction && editingTransaction.transactionId) {
        endpoint += `/${editingTransaction.transactionId}`;
        method = 'PUT';
      } else {
        // For new transactions, include the consumerId in the payload
        if (!selectedConsumerId) {
          throw new Error("Consumer ID is missing for new Wasooli transaction");
        }
        payload = { ...payload, consumerId: selectedConsumerId };
      }

      const response = await fetch(endpoint, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to save Wasooli transaction");
      }

      console.log("Wasooli transaction saved:", await response.json());

      setIsWasooliVisible(false);
      setWasooliData({ date: '', wasooli: '' });
      setEditingTransaction(null);
      await fetchData();

    } catch (error) {
      console.error("Error saving Wasooli transaction:", error);
      setIsAlertVisible(true);
      setAlertMessage(error.toString());
    }
  };

  // Toggle visibility for an individual month (optional, if you need finer control)

  const renderWasooliTransactions = (consumer) => {
    // Ensure consumer.wasooliTransactions is an array.
    const transactions = consumer.wasooliTransactions || [];
    const transactionsByMonth = transactions.reduce((acc, transaction) => {
      const monthYear = new Date(transaction.date).toLocaleString('default', { month: 'long', year: 'numeric' });
      if (!acc[monthYear]) acc[monthYear] = [];
      acc[monthYear].push(transaction);
      return acc;
    }, {});

    return Object.entries(transactionsByMonth).map(([monthYear, transactions]) => {
      // Check if the monthYear is visible based on the state.
      const isButtonVisible = monthYearButtonsVisibility[consumer.idconsumerkhata];
      const isDataVisible = monthVisibility[consumer.idconsumerkhata]?.[monthYear] ?? false;
      return (

        <div key={monthYear}>
         {isButtonVisible && (
            <button className="toggle-visibility-button" onClick={() => toggleMonthVisibility(consumer.idconsumerkhata, monthYear)}>
              {isDataVisible ? translations[language].Hide : translations[language].Show} {monthYear}
            </button>
          )} 
          {isDataVisible && transactions.map((transaction, index) => (
            <div className="wasooli-card-horizontal" key={index}>
              {/* Ensure the property names match what's returned from the database. */}
              <span>{translations[language].date} : {transaction.date}</span> {/* If your database returns 'date' in lowercase */}
              <span>{translations[language].wasooli} : {transaction.Wasooli}</span> {/* If your database returns 'wasooli' in lowercase */}
              <button className="updatee-button" onClick={() => handleUpdateWasooliClick(consumer.idconsumerkhata, transaction.idwasooli)}>
                {translations[language].update}
              </button>
              <button className="deletee-button" onClick={() => handleDeleteWasooliClick(consumer.idconsumerkhata, transaction.idwasooli, index)}>
                {translations[language].delete}
              </button>

            </div>
          ))}
        </div>
      );
    });
  };


  return (
    <div className="consumer-khata-container">
      <h1 className="header">{translations[language].consumerKhata}</h1>
      <button onClick={() => setLanguage(lang => lang === 'English' ? 'Urdu' : 'English')} className="language-toggle">
        {language === 'English' ? 'اردو' : 'English'}
      </button>
      {isConfirmModalVisible && (
        <ConfirmationModal onConfirm={handleConfirmDeletion} onCancel={handleCancelDeletion} />

      )}
      <AlertModal
        isOpen={isAlertVisible}
        message={alertMessage}
        onClose={() => setIsAlertVisible(false)}
      />
      {
        consumers.map((consumer) => (
          <div className="consumer-card" key={consumer.idconsumerkhata}>
            <h2 className="consumer-name">{consumer.name} {translations[language].Khata}</h2>
            <p>{translations[language].date} : {consumer.Date}</p>
            <p>{translations[language].consumerName} : {consumer.name}</p>
            <p>{translations[language].baqaya} : {consumer.baqaya}</p>
            <div className="action-buttons">
              <button className="manage-buttonn" onClick={() => handleManageClick(consumer.idconsumerkhata)}>
                {translations[language].manage}
              </button>
              <button className="add-baqaya-buttonn" onClick={() => {
                setIsAddBaqayaVisible(true);
                setSelectedConsumerId(consumer.idconsumerkhata); // Ensure this is set when opening the Baqaya add form
              }}>
                {translations[language].addBaqaya}
              </button>
              <button className="update-buttonn" onClick={() => handleUpdateClick(consumer.idconsumerkhata)}>
                {translations[language].update}
              </button>

            </div>
            <button className="global-toggle-buttonn" onClick={() => toggleMonthYearButtonsVisibility(consumer.idconsumerkhata)}>
              {monthYearButtonsVisibility[consumer.idconsumerkhata] ? translations[language].hideAll : translations[language].showAll}
            </button>

            {renderWasooliTransactions(consumer)}

            {currentManaging === consumer.idconsumerkhata && isWasooliVisible && (
              <div className="form-container wasooli-card">
                <h2>{translations[language].wasooli}</h2>
                <button className="close-button" onClick={() => setIsWasooliVisible(false)}>
                  &#10005;
                </button>
                <span className="error-message">{wasooliErrorMessages.date}</span>
                <input
                  type="date"
                  name="date"
                  placeholder={translations[language].datee}
                  value={wasooliData.date || ''}
                  onChange={handleWasooliInputChange}
                />

                <span className="error-message">{wasooliErrorMessages.wasooli}</span>
                <input
                  type="number"
                  name="wasooli"
                  placeholder={translations[language].wasooliAmountt}
                  value={wasooliData.wasooli || ''} // Fallback to empty string if undefined
                  onChange={handleWasooliInputChange}
                />

                <button className="save-button" onClick={(e) => {
                  e.preventDefault();
                  handleSaveWasooliClick();
                }}>
                  {translations[language].saveWasooli}
                </button>
              </div>
            )}

            {selectedConsumerId === consumer.idconsumerkhata && isAddBaqayaVisible && (
              <div className="add-baqaya-card">
                <button className="close-button" onClick={() => setIsAddBaqayaVisible(false)} >
                  &#10005;
                </button>
                <span className="error-message">{baqayaError}</span>
                <input
                  type="number"
                  placeholder={translations[language].baqayaa}
                  value={baqayaToAdd}
                  onChange={handleBaqayaInputChange}
                />

                <button className="save-baqaya-button" onClick={handleSaveBaqayaClick}>
                  {translations[language].save}
                </button>
              </div>
            )}

          </div>

        ))
      }
      <ConfirmAddModal
        isOpen={isAddConsumerConfirmVisible}
        onConfirm={() => {
          setIsAddConsumerConfirmVisible(false);
          setIsFormVisible(true); // Show the form if the user confirms
        }}
        onCancel={() => setIsAddConsumerConfirmVisible(false)}
      />
      {isFormVisible && (
        <div className="form-container">
          <button className="close-button" onClick={handleCancelClick}>
            &#10005;
          </button>
          <span className="error-message">{errorMessages.date}</span>
          <input
            type="date"
            name="date"
            placeholder={translations[language].datee}
            value={consumerData.date}
            onChange={handleInputChange}
          />

          <span className="error-message">{errorMessages.consumerName}</span>
          <input
            type="text"
            name="consumerName"
            placeholder={translations[language].consumerNamee}
            value={consumerData.consumerName}
            onChange={handleInputChange}
          />

          <span className="error-message">{errorMessages.baqaya}</span>
          <input
            type="text"
            name="baqaya"
            placeholder={translations[language].baqayaa}
            value={consumerData.baqaya}
            onChange={handleInputChange}
          />

          <button className="save-button" onClick={handleSaveClick}>
            {translations[language].save}
          </button>
        </div>
      )}

      <button className="add-button" onClick={handleAddConsumerClick}>
        {translations[language].addConsumer}
      </button>

    </div>
  );
};

export default ConsumerKhata;