function statement (invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result=``;
  const format = formatMoneytoUS();
  ({ volumeCredits, totalAmount } = createResult(invoice, plays, volumeCredits, totalAmount));
  
  return printResult(headResult(invoice),createTxtLine(invoice, plays, result, format),totalAmount,volumeCredits,format)

}

function printResult(head,lineData,totalAmount,volumeCredits,format) {
    return head+`\n`+
          lineData
          +`Amount owed is ${format(totalAmount / 100)}\n`
          +`You earned ${volumeCredits} credits \n`
}


function formatMoneytoUS() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format;
}

function createTxtLine(invoice, plays, result, format) {
  for (let performance of invoice.performances) {
    const play = plays[performance.playID];
    let thisAmount = 0;
    thisAmount = calculateAmount(play, thisAmount, performance);
    result += ` ${play.name}: ${format(thisAmount / 100)} (${performance.audience} seats)\n`;
  }
  return result;
}

function createResult(invoice, plays, volumeCredits, totalAmount) {
  for (let performance of invoice.performances) {
    const play = plays[performance.playID];
    let thisAmount = 0;
    thisAmount = calculateAmount(play, thisAmount, performance);
    volumeCredits = calculateCredits(volumeCredits, performance, play);
    totalAmount += thisAmount;
  }
  return { volumeCredits, totalAmount };
}

function headResult(invoice) {
  return `Statement for ${invoice.customer}`;
}

function calculateCredits(volumeCredits, perf, play) {
  volumeCredits += Math.max(perf.audience - 30, 0);
  if ('comedy' === play.type)
    volumeCredits += Math.floor(perf.audience / 5);
  return volumeCredits;
}

function calculateAmount(play, thisAmount, performance) {
  switch (play.type) {
    case 'tragedy':
      thisAmount = 40000;
      if (performance.audience > 30) {
        thisAmount += 1000 * (performance.audience - 30);
      }
      break;
    case 'comedy':
      thisAmount = 30000;
      if (performance.audience > 20) {
        thisAmount += 10000 + 500 * (performance.audience - 20);
      }
      thisAmount += 300 * performance.audience;
      break;
    default:
      throw new Error(`unknown type: ${play.type}`);
  }
  return thisAmount;
}

module.exports = {
  statement,
};
