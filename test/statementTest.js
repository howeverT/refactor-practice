const test = require('ava');
const { statement,statementHTML } = require('../src/statement');

test('Case 1, BigCo without performances', t => {
  //given
  const invoice = {
    'customer': 'BigCo',
    'performances': [],
  };

  const result = statement(invoice, plays);

  t.is(result, `Statement for BigCo\nAmount owed is $0.00\nYou earned 0 credits \n`);
});

test('Case 2, BigCo has 1 performances hamlet and the audience is 30', t => {
  //given
  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'hamlet',
        'audience': 30
      }
    ],
  };

  const result = statement(invoice, plays);

  t.is(result, `Statement for BigCo\n Hamlet: $400.00 (30 seats)\nAmount owed is $400.00\nYou earned 0 credits \n`);
});

test('Case 3, BigCo has 1 performances hamlet and the audience is 31', t => {
  //given
  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'hamlet',
        'audience': 31
      }
    ],
  };

  const result = statement(invoice, plays);

  t.is(result, `Statement for BigCo\n Hamlet: $410.00 (31 seats)\nAmount owed is $410.00\nYou earned 1 credits \n`);
});

test('Case 4, BigCo has 1 performances As You Like It and the audience is 20', t => {
  //given
  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'as-like',
        'audience': 20
      }
    ],
  };

  const result = statement(invoice, plays);

  t.is(result, `Statement for BigCo\n As You Like It: $360.00 (20 seats)\nAmount owed is $360.00\nYou earned 4 credits \n`);
});

test('Case 5, BigCo has 1 performances As You Like It and the audience is 21', t => {
  //given
  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'as-like',
        'audience': 21
      }
    ],
  };

  const result = statement(invoice, plays);

  t.is(result, `Statement for BigCo\n As You Like It: $468.00 (21 seats)\nAmount owed is $468.00\nYou earned 4 credits \n`);
});

test('Case 6, BigCo has 3 performances hamlet has 55 audiences and As You Like It has 35 audiences and Othello has 40 audiences', t => {
  //given
  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'hamlet',
        'audience': 55,
      },
      {
        'playID': 'as-like',
        'audience': 35,
      },
      {
        'playID': 'othello',
        'audience': 40,
      },
    ],
  };

  const result = statement(invoice, plays);

  t.is(result, `Statement for BigCo\n Hamlet: $650.00 (55 seats)\n As You Like It: $580.00 (35 seats)\n Othello: $500.00 (40 seats)\nAmount owed is $1,730.00\nYou earned 47 credits \n`);
});

test('Case 7, BigCo has 1 performances unknown', t => {
  //given
  const plays2 = {
    'othello': {
      'name': 'Othello',
      'type': 'tragedy1',
    },
  };
  const invoice2 = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'othello',
        'audience': 40,
      },
    ],
  };

  try {
    statement(invoice2, plays2);
    t.fail();
  }
  catch (e) {
    t.is(e.message, 'unknown type: tragedy1');
  }
});

test('Case 8, BigCo has 3 performances hamlet has 55 audiences and As You Like It has 35 audiences and Othello has 40 audiences and return HTML', t => {
  //given
  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'hamlet',
        'audience': 55,
      },
      {
        'playID': 'as-like',
        'audience': 35,
      },
      {
        'playID': 'othello',
        'audience': 40,
      },
    ],
  };

  const result = statementHTML(invoice, plays);

  t.is(result, '<h1>Statement for BigCo</h1>\n' +
    '<table>\n' +
    '<tr><th>play</th><th>seats</th><th>cost</th></tr>' +
    ' <tr><td>Hamlet</td><td>55</td><td>$650.00</td></tr>\n' +
    ' <tr><td>As You Like It</td><td>35</td><td>$580.00</td></tr>\n' +
    ' <tr><td>Othello</td><td>40</td><td>$500.00</td></tr>\n' +
    '</table>\n' +
    '<p>Amount owed is <em>$1,730.00</em></p>\n' +
    '<p>You earned <em>47</em> credits</p>\n');

});

const plays = {
  'hamlet': {
    'name': 'Hamlet',
    'type': 'tragedy',
  },
  'as-like': {
    'name': 'As You Like It',
    'type': 'comedy',
  },
  'othello': {
    'name': 'Othello',
    'type': 'tragedy',
  },
};