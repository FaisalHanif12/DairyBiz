import React, { useState, useEffect } from 'react';
import './ConsumersDales.css';

const ConsumersDales = () => {

  const [source, setSource] = useState('');
  const [quantity, setQuantity] = useState('');
  const [amount, setAmount] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [showAlert, setShowAlert] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [groupVisibility, setGroupVisibility] = useState({});
  const [globalVisibility, setGlobalVisibility] = useState(false);
  const [showMonthlySales, setShowMonthlySales] = useState(false);
  const [language, setLanguage] = useState('English'); // Default to English
  // Define fetchData outside of useEffect
  const [showModal, setShowModal] = useState(false); // You already have this for controlling the visibility of the modal
  const [modalMessage, setModalMessage] = useState(''); // Add this line to manage the modal message

  const translations = {
    English: {
      title: "Consumer Sales",
      date: "Date",
      name: "Name",
      quantity: "Quantity",
      pricePerKilo: "Price per kilo",
      save: "Save",
      monthlyConsumerSale: "Monthly Consumer Sale",
      overallConsumerSale: "Overall Consumers Sale",
      showAll: "Show",
      hideAll: "Hide ",
      show: "Show ",
      hide: "Hide ",
      show1: "Show All",
      hide1: "Hide All",
      delete: "Delete",
      update: "Update",
      deletePrompt: "Are you sure you want to delete this?",
      yes: "Yes",
      no: "No",
      consumerName: "Consumer Name",
      total: "Total",
      ConsumerName: "Enter Consumer name ",
      Quantity: "Enter Milk Quantity",
      price: "Enter price per kilo ",
      KiloMilk: "Kilo Milk",
      kaa: "of",
      added: "has been added",
      In: "In",
      record: "Record has been updated",
    },
    Urdu: {
      title: "صارفین کی فروخت",
      date: "تاریخ",
      name: "نام",
      quantity: "مقدار",
      pricePerKilo: "فی کلو قیمت",
      save: "محفوظ کریں",
      monthlyConsumerSale: "ماہانہ صارفین کی فروخت",
      overallConsumerSale: "کل صارفین کی فروخت",
      showAll: " دیکھیں",
      hideAll: " چھپائیں",
      show: " دیکھیں",
      hide: " چھپائیں",
      show1: "سب دیکھیں",
      hide1: "سب چھپائیں",
      delete: "حذف کریں",
      update: "اپ ڈیٹ",
      deletePrompt: "کیا آپ واقعی اس  کو حذف کرنا چاہتے ہیں؟",
      yes: "ہاں",
      no: "نہیں",
      consumerName: "صارف کا نام",
      total: "کل",
      ConsumerName: "صارف کا نام درج کریں ",
      Quantity: "دودھ کی مقدار درج کریں ",
      price: "فی کلو قیمت درج کریں ",
      KiloMilk: "کلو دودھ",
      kaa: "کا",
      added: " شامل ہوگیا ہے",
      In: "میں",
      record: "ریکارڈ اپ ڈیٹ ہو گیا ہے",
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
        // Updated fetch request with explicit Accept header for JSON responses
        const response = await fetch('http://localhost:3001/consumerssale', {
            headers: {
                'Accept': 'application/json', // Explicitly expect JSON responses
            },
        });

        // Check if the response was successful
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Validate content type to be JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Expected JSON response, but received unexpected content type');
        }

        // Parse the JSON response and process data
        const data = await response.json();
        const processedData = data.map(expense => ({
            ...expense,
            Quantity: parseFloat(expense.Quantity),
            UnitPrice: parseFloat(expense.UnitPrice),
            Total: expense.Total ? parseFloat(expense.Total).toFixed(2) : undefined,
        }));

        // Log processed data for debugging
        console.log("Processed data:", processedData);

        // Assuming setExpenses is a state setter from useState hook
        // Update your component's state with the processed data
        setExpenses(processedData);
    } catch (error) {
        // Log the error and optionally handle it by setting some error state
        console.error('There was an error fetching the sales data:', error);

        // Assuming setError is a state setter for holding error information
        // setError(error.message) or similar could be used here
    }
};


  useEffect(() => {
    // Now you can call fetchData inside useEffect
    fetchData();
  }, []); // The empty dependency array ensures this runs only on mount

  // ... rest of your component


  const [date, setDate] = useState(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const year = today.getFullYear();

    return `${year}-${month}-${day}`;
  });
  const toggleMonthlySalesVisibility = () => {
    setShowMonthlySales(prevShow => !prevShow); // Toggle the visibility state
  };

  const toggleGroupVisibility = (monthYear) => {
    setGlobalVisibility(prevGlobalState => {
      if (!prevGlobalState) {
        // If global visibility is off, ensure it stays off and don't toggle individual groups
        console.warn("Global visibility is off. Can't toggle individual group visibility.");
        return prevGlobalState;
      }

      // If global visibility is on, toggle the specific month/year group
      setGroupVisibility(prevGroupVisibility => ({
        ...prevGroupVisibility,
        [monthYear]: !prevGroupVisibility[monthYear]
      }));

      return prevGlobalState; // Return the unchanged global state
    });
  };
  const CustomModal = ({ message, onClose }) => {
    return (
      <div className="custom-modal-overlay">
        <div className="custom-modal">
          <div className="custom-modal-content">
            <p>{message}</p>
            <button onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  };

  // Group expenses by month and year
  const groupedExpenses = expenses.reduce((acc, expense) => {
    // Ensure the date string is in the correct format (YYYY-MM-DD)
    const expenseDate = expense.Date; // Adjust if the API gives a different property name for the date
    const date = new Date(expenseDate);

    if (isNaN(date.getTime())) {
      console.error('Invalid date for expense:', expense);
      return acc; // Skip this expense if the date is invalid
    }

    const monthYear = `${date.toLocaleString('default', { month: 'long', year: 'numeric' })}`;
    if (!acc[monthYear]) {
      acc[monthYear] = [];
    }
    acc[monthYear].push(expense);

    return acc;
  }, {});

  const handleSave = async (e) => {
    e.preventDefault();

    const expensePayload = {
      Date: date,
      Name: source,
      Quantity: parseFloat(quantity),
      UnitPrice: parseFloat(amount),
    };

    try {
      let response;
      if (editIndex >= 0) {
        // Assuming your expense objects use 'idConsumersSale' as the key for ID
        const expenseId = expenses[editIndex].idConsumersSale; // Adjust this line accordingly
        response = await fetch(`http://localhost:3001/consumerssale/${expenseId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(expensePayload),
        });

        const monthYear = new Date(date).toLocaleString('default', { month: 'long', year: 'numeric' });
        const alertMessage = `${translations[language].record} `;

        // Replace alert(alertMessage); with:
        setModalMessage(alertMessage);
        setShowModal(true);

      } else {
        // Adding a new expense
        response = await fetch('http://localhost:3001/consumerssale', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(expensePayload),
        });

        const monthYear = new Date(date).toLocaleString('default', { month: 'long', year: 'numeric' });
        const alertMessage = `${quantity} ${translations[language].KiloMilk} ${translations[language].added}`;
        // Replace alert(alertMessage); with:
        setModalMessage(alertMessage);
        setShowModal(true);
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchData(); // Refresh data

      // Reset form fields and editIndex
      //setDate('');
      setSource('');
      setQuantity('');
      setAmount('');
      setEditIndex(-1);


    } catch (error) {
      console.error('There was an error saving the sale:', error);
    }
  };

  // This function is called when the delete button is clicked.
  // It sets up the alert and marks which item should be deleted if confirmed.
  const handleDelete = (index) => {
    setShowAlert(true);
    setDeleteIndex(index);
  };

  // This function is called when the user confirms the deletion.
  const handleAlertConfirm = async (isConfirmed) => {
    if (isConfirmed && deleteIndex != null) {
      const expense = expenses[deleteIndex];
      if (expense && expense.idConsumersSale) { // Make sure the ID field matches your data structure
        try {
          const response = await fetch(`http://localhost:3001/consumerssale/${expense.idConsumersSale}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          console.log(result.message); // Log the message from the backend

          // Refresh the expenses list after deleting an expense
          await fetchData();

        } catch (error) {
          console.error('There was an error deleting the sale:', error);
        }
      } else {
        console.error('Attempted to delete an expense without a valid ID');
      }
    }

    // Reset the state regardless of whether the delete was successful or not
    setDeleteIndex(null);
    setShowAlert(false);
  };


  const getMonthlyExpenses = () => {
    const monthlyExpenses = expenses.reduce((acc, expense) => {
      // Check if the date is valid
      const date = new Date(expense.Date);
      if (isNaN(date.getTime())) {
        console.error('Invalid date for expense:', expense);
        return acc; // Skip this expense if the date is invalid
      }

      const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;
      const expenseQuantity = parseFloat(expense.Quantity);
      const expenseUnitPrice = parseFloat(expense.UnitPrice);
      const monthlyTotal = !isNaN(expenseQuantity) && !isNaN(expenseUnitPrice) ? expenseQuantity * expenseUnitPrice : 0;

      if (!acc[monthYear]) {
        acc[monthYear] = 0;
      }

      acc[monthYear] += monthlyTotal;

      return acc;
    }, {});

    return monthlyExpenses;
  };


  const getOverallExpenses = () => {
    return expenses.reduce((acc, expense) => {
      const expenseQuantity = parseFloat(expense.Quantity);
      const expenseUnitPrice = parseFloat(expense.UnitPrice);
      const total = expenseQuantity && expenseUnitPrice ? expenseQuantity * expenseUnitPrice : 0;
      return acc + total;
    }, 0);
  };

  const handleUpdate = (index) => {
    const expense = expenses[index];
    // Adjust these property names to match your actual expense object structure
    setDate(expense.Date); // Assuming the date property is named "Date"
    setSource(expense.Name); // Assuming the consumer name property is named "Name"
    setQuantity(expense.Quantity.toString()); // Assuming the quantity property is named "Quantity"
    setAmount(expense.UnitPrice.toString()); // Assuming the unit price property is named "UnitPrice"
    setEditIndex(index);
  };
  const toggleGlobalVisibility = () => {
    setGlobalVisibility(prevState => {
      const newState = !prevState;
      // Update all group visibilities based on the new global state
      const newGroupVisibility = Object.keys(groupVisibility).reduce((acc, key) => {
        acc[key] = newState; // Show or hide all based on the new global state
        return acc;
      }, {});

      setGroupVisibility(newGroupVisibility);
      return newState;
    });
  };


  return (
    <div className="expenditure-container">
      <h1 className="expenditure-title">{translations[language].title}</h1>
      <button onClick={() => setLanguage(lang => lang === 'English' ? 'Urdu' : 'English')} className="language-toggle">
        {language === 'English' ? 'اردو' : 'English'}
      </button>
      <form className="expenditure-form" onSubmit={handleSave}>
        <label htmlFor="date" className="expenditure-label">{translations[language].date}:</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="expenditure-input date-input"
          required
        />

        <label htmlFor="source" className="expenditure-label">{translations[language].name}:</label>
        <input
          type="text"
          id="source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="expenditure-input"
          placeholder={translations[language].ConsumerName}
          required
        />

        <label htmlFor="quantity" className="expenditure-label">{translations[language].quantity}:</label>
        <input
          type="number"
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="expenditure-input"
          placeholder={translations[language].Quantity}
          required
        />

        <label htmlFor="amount" className="expenditure-label">{translations[language].pricePerKilo}:</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="expenditure-input"
          placeholder={translations[language].price}
          required
        />

        <button type="submit" className="save-button">{translations[language].save}</button>
      </form>
      {showModal && (
        <CustomModal
          message={modalMessage}
          onClose={() => setShowModal(false)}
        />
      )}
      <div className="expenses-report">
        <h4>{translations[language].monthlyConsumerSale}:</h4>

        <button onClick={toggleMonthlySalesVisibility} className="toggle-all-button">
          {showMonthlySales ? translations[language].hideAll : translations[language].showAll}
        </button>

        {showMonthlySales && Object.entries(getMonthlyExpenses()).map(([monthYear, total]) => {
          // Split month and year
          const [month, year] = monthYear.split(' ');

          // Translate the month name if available, otherwise, use the original name
          const translatedMonth = language === 'Urdu' ? monthTranslations[month] || month : month;

          // Combine translated month and year
          const translatedMonthYear = `${translatedMonth} ${year}`;

          return (
            <div key={monthYear} style={{ color: 'green' }}>
              {translations[language].monthlySales} {translatedMonthYear} : {total}
            </div>
          );
        })}


        <h4>{translations[language].overallConsumerSale}:<br /><span style={{ color: 'green' }}>{getOverallExpenses()}</span></h4>
      </div>
      <button onClick={toggleGlobalVisibility} className="global-toggle-button">
        {globalVisibility ? translations[language].hide1 : translations[language].show1}
      </button>

      {globalVisibility && Object.entries(groupedExpenses).map(([monthYear, expensesList]) => (
        // Your existing map function
        (() => {
          // Move the statements outside of JSX
          const monthYearArray = monthYear.split(' ');
          const month = monthYearArray[0];
          const year = monthYearArray[1];

          // Translate the month name if the current language is Urdu
          const translatedMonthName = language === 'Urdu' ? (monthTranslations[month] || month) : month;

          // Reconstruct the monthYear string with the possibly translated month name
          const displayMonthYear = `${translatedMonthName} ${year}`;

          return (
            <div key={monthYear}>
              <h3 style={{ marginTop: 15 }}>
                {displayMonthYear}
                <button
                  onClick={() => toggleGroupVisibility(monthYear)}
                  className="toggle-button"
                >
                  {groupVisibility[monthYear] ? translations[language].hide : translations[language].show}
                </button>
              </h3>
              {groupVisibility[monthYear] && (
                <div className="expenses-display">
                  {expensesList.map((expense, index) => {
                    const actualIndex = expenses.findIndex(e => e === expense);
                    const total = (!isNaN(expense.Quantity) && !isNaN(expense.UnitPrice))
                      ? (expense.Quantity * expense.UnitPrice).toFixed(2)
                      : 'N/A';
                    return (
                      <div key={index} className="expense-card">
                        <div>{translations[language].date}: {expense.Date}</div>
                        <div>{translations[language].consumerName}: {expense.Name}</div>
                        <div>{translations[language].quantity}: {Number.isFinite(expense.Quantity) ? expense.Quantity : 'N/A'}</div>
                        <div>{translations[language].pricePerKilo}: {Number.isFinite(expense.UnitPrice) ? expense.UnitPrice : 'N/A'}</div>
                        <div>{translations[language].total}: {expense.Total}</div>

                        <button onClick={() => handleDelete(actualIndex)} className="delete-button1">{translations[language].delete}</button>
                        <button onClick={() => handleUpdate(actualIndex)} className="update-button">{translations[language].update}</button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })()
      ))}

      {showAlert && (
        <div className="alert-dialog">
          <p>{translations[language].deletePrompt}</p>
          <button onClick={() => handleAlertConfirm(true)} className="confirm-yes">{translations[language].yes}</button>
          <button onClick={() => handleAlertConfirm(false)} className="confirm-no" >{translations[language].no}</button>
        </div>
      )}

    </div>

  );
};

export default ConsumersDales;
