import React, { useState, useEffect } from 'react';
import './Expenditure.css';

const Expenditure = () => {
  const [date, setDate] = useState(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const year = today.getFullYear();

    return `${year}-${month}-${day}`;
  });
  const [source, setSource] = useState('');
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
      title: "Expenditure khata",
      date: "Date",
      source: "Source of Expense",
      amount: "Amount",
      save: "Save",
      monthlyExpenseReport: "Monthly Expense Report:",
      overallExpenses: "Overall Expenses:",
      showAll: "Show All",
      hideAll: "Hide All",
      delete: "Delete",
      update: "Update",
      deletePrompt: "Are you sure you want to delete this expense?",
      yes: "Yes",
      no: "No",
      show: "Show",
      hide: "Hide",
      KiloMilk: "Kilo Milk",
      kaa: "of",
      added: "has been added",
      In: "In",
      enterSource :"Enter source expense ",
      enterAmount: "Enter amount of Expense",
      expens : "Expense",
   
      record: "Record has been updated",
    },
    Urdu: {
      title: "خرچے کا حساب",
      date: "تاریخ",
      source: "خرچے کا ذریعہ",
      amount: "رقم",
      save: "محفوظ کریں",
      monthlyExpenseReport: "ماہانہ خرچہ رپورٹ:",
      overallExpenses: "کل خرچے:",
      showAll: "سب دیکھیں",
      hideAll: "سب چھپائیں",
      delete: "حذف کریں",
      update: "اپ ڈیٹ",
      deletePrompt: "کیا آپ واقعی اس خرچے کو حذف کرنا چاہتے ہیں؟",
      yes: "ہاں",
      no: "نہیں",
      show: " دیکھیں",
      hide: " چھپائیں",
      KiloMilk: "کلو دودھ",
      kaa: "کا",
      added: " شامل ہوگیا ہے",
      In: "میں",
      enterSource: "خرچے کا ذریعہ درج کریں",
      enterAmount: "خرچے کی رقم درج کریں",
      expens : 'اخراجات',
      record: "ریکارڈ اپ ڈیٹ ہو گیا ہے",
    },

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
      const response = await fetch('http://localhost:3001/expenditure');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const processedData = data.map(expense => ({
        ...expense,
        amount: parseFloat(expense.amount),

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
      source: source,

      amount: parseFloat(amount),
    };

    try {
      let response;
      if (editIndex >= 0) {
        // Assuming your expense objects use 'idConsumersSale' as the key for ID
        const expenseId = expenses[editIndex].idexpenditure; // Adjust this line accordingly
        response = await fetch(`http://localhost:3001/expenditure/${expenseId}`, {
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
        response = await fetch('http://localhost:3001/expenditure', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(expensePayload),
          
        });

        const monthYear = new Date(date).toLocaleString('default', { month: 'long', year: 'numeric' });
        const alertMessage = `${amount} ${translations[language].expens} ${translations[language].added} `;
        // Replace alert(alertMessage); with:
        setModalMessage(alertMessage);
        setShowModal(true);

      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchData(); // Refresh data

      setSource('');
      setAmount('');
      setEditIndex(-1);

    
    } catch (error) {
      console.error('There was an error saving the sale:', error);
    }
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

  const handleDelete = (index) => {
    setShowAlert(true);
    setDeleteIndex(index);
  };

  const handleAlertConfirm = async (isConfirmed) => {
    if (isConfirmed && deleteIndex != null) {
      const expense = expenses[deleteIndex];
      if (expense && expense.idexpenditure) { // Make sure the ID field matches your data structure
        try {
          const response = await fetch(`http://localhost:3001/expenditure/${expense.idexpenditure}`, {
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
    return expenses.reduce((acc, expense) => {
      const expenseDate = new Date(expense.Date); // Adjust according to your actual data structure
      const monthYear = `${expenseDate.toLocaleString('default', { month: 'long' })} ${expenseDate.getFullYear()}`;
      const expenseAmount = isNaN(parseFloat(expense.amount)) ? 0 : parseFloat(expense.amount);

      if (!acc[monthYear]) acc[monthYear] = 0;
      acc[monthYear] += expenseAmount;

      return acc;
    }, {});
  };


  const getOverallExpenses = () => {

    return expenses.reduce((acc, expense) => acc + expense.amount, 0);
  };

  const handleUpdate = (index) => {
    const expense = expenses[index];
    // Correctly assign values from the expense object
    setDate(expense.Date); // Ensure the property names match your data structure
    setSource(expense.source); // This should be the source, not the total or any other field
    setAmount(expense.amount.toString());
    setEditIndex(index);
  };

  return (
    <div className="expenditure-container">
      <h1 className="expenditure-title">{translations[language].title}</h1>
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

        <label htmlFor="source" className="expenditure-label">{translations[language].source}</label>
        <input
          type="text"
          id="source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          className="expenditure-input"
          placeholder={translations[language].enterSource}
          required
        />

        <label htmlFor="amount" className="expenditure-label">{translations[language].amount}</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="expenditure-input"
          placeholder={translations[language].enterAmount}
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
        <h4>{translations[language].monthlyExpenseReport}</h4>

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


        <h4>{translations[language].overallExpenses}<br /><span style={{ color: 'green' }}>{getOverallExpenses()}</span></h4>
      </div>
      <button onClick={toggleGlobalVisibility} className="global-toggle-button">
        {globalVisibility ? translations[language].hideAll : translations[language].showAll}
      </button>

      {globalVisibility && Object.entries(groupedExpenses).map(([monthYear, expensesList]) => (
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
                    return (
                      <div key={index} className="expense-card">
                        <div>{translations[language].date} : {expense.Date}</div>
                        <div>{translations[language].source} : {expense.source}</div>
                        <div>{translations[language].amount} : {expense.amount}</div>
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
          <p>{translations[language].deletePrompt} :</p>
          <button onClick={() => handleAlertConfirm(true)} className="confirm-yes">{translations[language].yes} </button>
          <button onClick={() => handleAlertConfirm(false)} className="confirm-no" >{translations[language].no} </button>
        </div>
      )}
    </div>
  );
};

export default Expenditure;
