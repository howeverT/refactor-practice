function statement (invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = headResult(invoice);
  const format = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format;
  ({ volumeCredits, result, totalAmount } = createLineResult(invoice, plays, volumeCredits, result, format, totalAmount));
  
  return createResult(result, format, totalAmount, volumeCredits);

}

function createLineResult(invoice, plays, volumeCredits, result, format, totalAmount) {
  for (let performance of invoice.performances) {
    const play = plays[performance.playID];
    let thisAmount = 0;
    thisAmount = calculateAmount(play, thisAmount, performance);
    volumeCredits = calculateCredits(volumeCredits, performance, play);
    //print line for this order
    result += ` ${play.name}: ${format(thisAmount / 100)} (${performance.audience} seats)\n`;
    totalAmount += thisAmount;
  }
  return { volumeCredits, result, totalAmount };
}

function headResult(invoice) {
  return `Statement for ${invoice.customer}\n`;
}

function calculateCredits(volumeCredits, perf, play) {
  // add volume credits
  volumeCredits += Math.max(perf.audience - 30, 0);
  // add extra credit for every ten comedy attendees
  if ('comedy' === play.type)
    volumeCredits += Math.floor(perf.audience / 5);
  return volumeCredits;
}

function createResult(result, format, totalAmount, volumeCredits) {
  result += `Amount owed is ${format(totalAmount / 100)}\n`;
  result += `You earned ${volumeCredits} credits \n`;
  return result;
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
