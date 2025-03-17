import { useState, useEffect, useCallback } from "react";
import "../css/BalanceSheet.css";

const BalanceSheet = ({ expenses, members = [] }) => {
  const [balances, setBalances] = useState({});
  const [settledMembers, setSettledMembers] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  
  useEffect(() => {
    const savedBalances = JSON.parse(localStorage.getItem("balances"));
    if (savedBalances) {
      setBalances(savedBalances);
    }
  }, []);

  
  useEffect(() => {
    if (Object.keys(balances).length > 0) {
      localStorage.setItem("balances", JSON.stringify(balances));
    }
  }, [balances]);

  
  const calculateBalances = useCallback(() => {
    if (!Array.isArray(members) || members.length === 0) {
      console.warn("⏳ Waiting for members to load...");
      return;
    }

    const balanceMap = members.reduce((acc, member) => {
      acc[member.name] = 0;
      return acc;
    }, {});

    expenses.forEach(({ amount, payer, splitType, percentages }) => {
      if (splitType === "equal") {
        const share = amount / members.length;
        members.forEach(({ name }) => {
          if (name === payer) {
            balanceMap[name] += amount - share * (members.length - 1);
          } else {
            balanceMap[name] -= share;
          }
        });
      } else if (splitType === "percentage" && percentages) {
        Object.entries(percentages).forEach(([member, percent]) => {
          const memberShare = (amount * percent) / 100;
          if (typeof balanceMap[member] === "number") {
            balanceMap[member] += member === payer ? amount - memberShare : -memberShare;
          }
        });
      }
    });

    console.log("✅ Final Balances:", balanceMap);
    setBalances(balanceMap);
    setIsLoading(false);
  }, [members, expenses]);

  useEffect(() => {
    if (members.length > 0 && expenses.length > 0) {
      calculateBalances();
    }
  }, [expenses, members, calculateBalances]);


  const markAsSettled = (name) => {
    setSettledMembers((prev) => ({ ...prev, [name]: true }));
  };

  return (
    <div className="balance-sheet">
      {isLoading ? (
        <p>⏳ Loading members...</p>
      ) : (
        <>
          <h3>Balances</h3>
          {Object.keys(balances).length > 0 ? (
            Object.entries(balances).map(([name, amount], index) => (
              <p key={index}>
                {name} {amount > 0 ? "will receive" : "owes"} ₹
                {Math.abs(amount).toFixed(2)}
                {amount < 0 && (
                  <button
                    onClick={() => markAsSettled(name)}
                    disabled={settledMembers[name]}
                  >
                    {settledMembers[name] ? "✅ Settled" : "Settle"}
                  </button>
                )}
              </p>
            ))
          ) : (
            <p>No balances to settle.</p>
          )}
        </>
      )}
    </div>
  );
};

export default BalanceSheet;
