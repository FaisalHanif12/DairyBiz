import React, { useState, useEffect } from 'react';
import './Sales.css';

const Sales = () => {
  const [salesSummary, setSalesSummary] = useState({});
  const [language, setLanguage] = useState('English');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSalesSummary();
  }, []);

  const fetchSalesSummary = async () => {
    try {
      const response = await fetch('http://localhost:3001/sales_summary');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setSalesSummary(data);
    } catch (error) {
      setError('Failed to fetch sales data');
      console.error('There was an issue fetching sales data:', error);
    }
  };

  const translations = {
    English: {
      title: "Sales Summary",
      error: "Error fetching data",
      totalSalesLabel: "Sales before Expenditure",
      netSalesLabel: "Sales after Expenditure",
      totalSales: "Total Sales",
      netSales: "Net Sales"
    },
    Urdu: {
      title: "خلاصہ فروخت",
      error: "ڈیٹا حاصل کرنے میں خرابی",
      totalSalesLabel: "اخراجات سے پہلے فروخت",
      netSalesLabel: "اخراجات کے بعد فروخت",
      totalSales: "کل فروخت",
      netSales: "خالص فروخت"
    }
  };

  return (
    <div className="sales-container">
      <h1 className="sales-title">{translations[language].title}</h1>
      <button className="language-toggle" onClick={() => setLanguage(lang => lang === 'English' ? 'Urdu' : 'English')}>
        {language === 'English' ? 'اردو' : 'English'}
      </button>
      {error && <p className="error">{translations[language].error}</p>}
      <div className="sales-summary">
        <p className="sales-label">{translations[language].totalSalesLabel}</p>
        <p>{`${translations[language].totalSales}: ${salesSummary.total_sales || 0}`}</p>
        <p className="sales-label">{translations[language].netSalesLabel}</p>
        <p>{`${translations[language].netSales}: ${salesSummary.net_sales || 0}`}</p>
      </div>
    </div>
  );
};

export default Sales;
