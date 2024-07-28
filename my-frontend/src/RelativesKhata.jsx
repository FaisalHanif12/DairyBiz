import React, { useState, useEffect } from 'react';
import './RelativesKhata.css';

const RelativesKhata = () => {
  const [date, setDate] = useState(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const year = today.getFullYear();

    return `${year}-${month}-${day}`;
  });
  const [source, setSource] = useState('');
  const [quantity, setQuantity] = useState('');
  const [amount, setAmount] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [showAlert, setShowAlert] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [groupVisibility, setGroupVisibility] = useState({});
  const [showMonthlySales, setShowMonthlySales] = useState(false);
  const [globalVisibility, setGlobalVisibility] = useState(false);
  const [showModal, setShowModal] = useState(false); // You already have this for controlling the visibility of the modal
  const [modalMessage, setModalMessage] = useState(''); // Add this line to manage the modal message
  const [language, setLanguage] = useState('English');
  const translations = {
    English: {
      date: "Date",
      name: "Name",
      quantity: "Quantity",
      pricePerKilo: "Price per kilo",
      save: "Save",
      monthlyRelativesSale: "Monthly Relatives Sale",
      overallRelativesSale: "Overall Relatives Sale",
      showAll: "Show All",
      hideAll: "Hide All",
      show: "Show ",
      hide: "Hide ",
      delete: "Delete",
      update: "Update",
      deletePrompt: "Are you sure you want to delete this?",
      yes: "Yes",
      no: "No",
      total: "Total",
      relativeName: "Relative Name",
      enterRelativeName: "Enter Relative Name",
      enterQuantity: "Enter Quantity",
      enterPricePerKilo: "Enter Price per kilo",
      relativesKhata: "Relatives Sales",
      KiloMilk:  "Kilo Milk", 
      kaa: "of",
      added: "has been added",
      In: "In", 
      expens : "Expense",
      record: "Record has been updated",
    },
    Urdu: {
      date: "تاریخ",
      name: "نام",
      quantity: "مقدار",
      pricePerKilo: "فی کلو قیمت",
      save: "محفوظ کریں",
      monthlyRelativesSale: "ماہانہ رشتہ داروں کی فروخت",
      overallRelativesSale: "کل رشتہ داروں کی فروخت",
      showAll: "سب دیکھیں",
      hideAll: "سب چھپائیں",
      show: "دیکھیں",
      hide: "چھپائیں",
      delete: "حذف کریں",
      update: "اپ ڈیٹ",
      deletePrompt: "کیا آپ واقعی اس  کو حذف کرنا چاہتے ہیں؟",
      yes: "ہاں",
      no: "نہیں",
      relativeName: "رشتہ دار کا نام",
      enterRelativeName: "رشتہ دار کا نام درج کریں",
      enterQuantity: "مقدار درج کریں",
      enterPricePerKilo: "فی کلو قیمت درج کریں",
      relativesKhata:   "رشتہ داروں کی فروخت",
      total: "کل",
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
      const response = await fetch('http://localhost:3001/relatives');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const processedData = data.map(expense => ({
        ...expense,
        Quantity: parseFloat(expense.Quantity),
        RUnitPrice: parseFloat(expense.RUnitPrice),
        RTotal: expense.RTotal ? parseFloat(expense.RTotal).toFixed(2) : undefined
      }));
      setExpenses(processedData);
    } catch (error) {
      console.error('There was an error fetching the sales data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      Rname: source,
      Quantity: parseFloat(quantity),
      RUnitPrice: parseFloat(amount),
    };

    try {
      let response;
      if (editIndex >= 0) {
        // Assuming your expense objects use 'idConsumersSale' as the key for ID
        const expenseId = expenses[editIndex].idRelatives; // Adjust this line accordingly
        response = await fetch(`http://localhost:3001/relatives/${expenseId}`, {
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
        response = await fetch('http://localhost:3001/relatives', {
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

  const handleDelete = (index) => {
    setShowAlert(true);
    setDeleteIndex(index);
  };

  const handleAlertConfirm = async (isConfirmed) => {
    if (isConfirmed && deleteIndex != null) {
      const expense = expenses[deleteIndex];
      if (expense && expense.idRelatives) { // Make sure the ID field matches your data structure
        try {
          const response = await fetch(`http://localhost:3001/relatives/${expense.idRelatives}`, {
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
      const expenseUnitPrice = parseFloat(expense.RUnitPrice);
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
      const expenseUnitPrice = parseFloat(expense.RUnitPrice);
      const total = expenseQuantity && expenseUnitPrice ? expenseQuantity * expenseUnitPrice : 0;
      return acc + total;
    }, 0);
  };

  const handleUpdate = (index) => {
    const expense = expenses[index];
    setDate(expense.Date);
    setSource(expense.Rname); // Corrected: ensure this matches your data structure
    setQuantity(expense.Quantity.toString());
    setAmount(expense.RUnitPrice.toString());
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

  const toggleMonthlySalesVisibility = () => {
    setShowMonthlySales(prevShow => !prevShow); // Toggle the visibility state


  };
  return (
    <div className="expenditure-container">
      <h1 className="expenditure-title">{translations[language].relativesKhata}</h1>
      <button onClick={() => setLanguage(lang => lang === 'English' ? 'Urdu' : 'English')} className="language-toggle">
        {language === 'English' ? 'اردو' : 'English'}
      </button>
      <form className="expenditure-form" onSubmit={handleSave}>
        <label htmlFor="date" className="expenditure-label">{translations[language].date}</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="expenditure-input date-input"
          required
        />

        <label htmlFor="source" className="expenditure-label">{translations[language].name}</label>
        <input
          type="text"
          id="source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="expenditure-input"
          placeholder={translations[language].relativeName}
          required
        />

        <label htmlFor="quantity" className="expenditure-label">{translations[language].quantity}</label>
        <input
          type="number"
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          className="expenditure-input"
          placeholder={translations[language].enterQuantity}
          required
        />

        <label htmlFor="amount" className="expenditure-label">{translations[language].pricePerKilo}</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="expenditure-input"
          placeholder={translations[language].enterPricePerKilo}
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
        <h4>{translations[language].monthlyRelativesSale}</h4>

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

        <h4>{translations[language].overallRelativesSale}<br /><span style={{ color: 'green' }}>{getOverallExpenses()}</span></h4>
      </div>
      <button onClick={toggleGlobalVisibility} className="global-toggle-button">
        {globalVisibility ? translations[language].hideAll : translations[language].showAll}
      </button>

      {globalVisibility && Object.entries(groupedExpenses).map(([monthYear, expensesList]) => (
        // Move the statements outside of JSX
        (() => {
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
                    const total = expense.quantity * expense.amount;
                    return (
                      <div key={index} className="expense-card">
                        <div>{translations[language].date} : {expense.Date}</div>
                        <div>{translations[language].name} : {expense.Rname}</div>
                        <div>{translations[language].quantity} : {expense.Quantity}</div>
                        <div>{translations[language].pricePerKilo} : {expense.RUnitPrice}</div>
                        <div>{translations[language].total} :  {expense.RTotal}</div>
                        <button onClick={() => handleDelete(actualIndex)} className="delete-button1">{translations[language].delete} </button>
                        <button onClick={() => handleUpdate(actualIndex)} className="update-button">{translations[language].update} </button>
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
          <p>{translations[language].deletePrompt} </p>
          <button onClick={() => handleAlertConfirm(true)} className="confirm-yes">{translations[language].yes} </button>
          <button onClick={() => handleAlertConfirm(false)} className="confirm-no" >{translations[language].no} </button>
        </div>
      )}

    </div>

  );
};

export default RelativesKhata;
