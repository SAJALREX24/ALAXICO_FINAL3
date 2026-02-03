import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Calculator, Check, CreditCard, Clock, Percent } from 'lucide-react';
import { Button } from './ui/button';

const EMICalculator = ({ productId, productPrice, productName, onSelectEMI }) => {
  const [emiOptions, setEmiOptions] = useState([]);
  const [selectedEMI, setSelectedEMI] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (productPrice >= 50000) {
      fetchEMIOptions();
    }
  }, [productId, productPrice]);

  const fetchEMIOptions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/emi/calculate?amount=${productPrice}`);
      setEmiOptions(response.data.emi_options);
    } catch (err) {
      setError(err.response?.data?.detail || 'EMI not available');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEMI = (option) => {
    setSelectedEMI(option);
    if (onSelectEMI) {
      onSelectEMI(option);
    }
  };

  if (productPrice < 50000) {
    return null;
  }

  if (loading) {
    return (
      <div className="mt-4 p-4 bg-slate-50 rounded-xl animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-1/3 mb-2"></div>
        <div className="h-8 bg-slate-200 rounded w-full"></div>
      </div>
    );
  }

  if (error) {
    return null;
  }

  return (
    <div className="mt-6 border-2 border-blue-100 rounded-xl overflow-hidden" data-testid="emi-calculator">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-green-500 px-4 py-3">
        <div className="flex items-center space-x-2 text-white">
          <CreditCard className="w-5 h-5" />
          <span className="font-semibold">EMI Options Available</span>
        </div>
        <p className="text-blue-100 text-sm mt-1">No Cost EMI on select options</p>
      </div>

      {/* EMI Options */}
      <div className="p-4 bg-white">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {emiOptions.map((option) => (
            <button
              key={option.tenure_months}
              onClick={() => handleSelectEMI(option)}
              className={`relative p-3 rounded-xl border-2 transition-all text-left ${
                selectedEMI?.tenure_months === option.tenure_months
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
              }`}
              data-testid={`emi-option-${option.tenure_months}`}
            >
              {option.is_no_cost && (
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                  No Cost
                </span>
              )}
              
              <div className="flex items-center space-x-1 text-slate-600 text-xs mb-1">
                <Clock className="w-3 h-3" />
                <span>{option.tenure_months} months</span>
              </div>
              
              <p className="text-lg font-bold text-slate-900">
                ₹{option.monthly_emi.toLocaleString()}
                <span className="text-xs font-normal text-slate-500">/mo</span>
              </p>
              
              {!option.is_no_cost && (
                <p className="text-xs text-slate-500 mt-1">
                  @ {option.interest_rate}% p.a.
                </p>
              )}
              
              {selectedEMI?.tenure_months === option.tenure_months && (
                <div className="absolute top-2 right-2">
                  <Check className="w-4 h-4 text-blue-500" />
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Selected EMI Details */}
        {selectedEMI && (
          <div className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-green-50 rounded-xl">
            <h4 className="font-semibold text-slate-900 mb-3">EMI Summary</h4>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-slate-500">Monthly EMI</p>
                <p className="text-lg font-bold text-blue-600">₹{selectedEMI.monthly_emi.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-slate-500">Tenure</p>
                <p className="text-lg font-bold text-slate-900">{selectedEMI.tenure_months} months</p>
              </div>
              <div>
                <p className="text-slate-500">Interest Rate</p>
                <p className="font-semibold text-slate-700">
                  {selectedEMI.is_no_cost ? (
                    <span className="text-green-600">0% (No Cost)</span>
                  ) : (
                    `${selectedEMI.interest_rate}% p.a.`
                  )}
                </p>
              </div>
              <div>
                <p className="text-slate-500">Total Amount</p>
                <p className="font-semibold text-slate-700">₹{selectedEMI.total_amount.toLocaleString()}</p>
              </div>
            </div>
            
            {selectedEMI.interest_amount > 0 && (
              <p className="text-xs text-slate-500 mt-3">
                Interest: ₹{selectedEMI.interest_amount.toLocaleString()}
              </p>
            )}
          </div>
        )}

        <p className="text-xs text-slate-500 mt-4">
          * EMI available on credit cards from select banks. T&C apply.
        </p>
      </div>
    </div>
  );
};

export default EMICalculator;
