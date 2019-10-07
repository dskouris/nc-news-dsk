process.env.NODE_ENV = 'test';
const { expect } = require('chai');
const {
  formatDates,
  makeRefObj,
  formatComments
} = require('../db/utils/utils');

describe('formatDates', () => {
  it('returns an empty array when passed an empty array', () => {
    expect(formatDates([])).to.eql([]);
  });
  it('returns an array containing a correctly formatted date when passed an array with single timestamp', () => {
    expect(
      formatDates([{ created_at: 1471522072389 }])[0].created_at instanceof Date
    ).to.be.true;
  });
  it('returns an array containing objects with correctly formatted dates when passed an array with multiple objects', () => {
    const isDate = obj => {
      return obj.created_at instanceof Date;
    };
    expect(
      formatDates([
        { created_at: 1471522072389 },
        { created_at: 1471522072345 },
        { created_at: 1471522072389 }
      ]).every(isDate)
    ).to.be.true;
  });
});

describe.only('makeRefObj', () => {
  it('returns an empty array if passed an empty array', () => {
    expect(makeRefObj([])).to.eql([]);
  });
  it('returns a formatted reference object when passed an array containing single item', () => {
    expect(makeRefObj([{ article_id: 1, title: 'A' }])).to.eql({ A: 1 });
  });
  it('returns a formatted reference object from an array of multiple items', () => {
    expect(
      makeRefObj([
        { article_id: 1, title: 'A' },
        { article_id: 2, title: 'B' },
        { article_id: 3, title: 'C' }
      ])
    ).to.eql({ A: 1, B: 2, C: 3 });
  });
});

describe('formatComments', () => {
  let testComment = [
    {
      body:
        "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
      belongs_to: "They're not exactly dogs, are they?",
      created_by: 'butter_bridge',
      votes: 16,
      created_at: 1511354163389
    }
  ];
  let testRef = { "They're not exactly dogs, are they?": 1 };
  it('returns an empty array when passed one', () => {
    expect(formatComments([])).to.eql([]);
  });
  it('returns a modified comment, renaming created_by key to author', () => {
    expect(formatComments(testComment, testRef)[0]).to.haveOwnProperty(
      'author'
    );
    expect(formatComments(testComment, testRef)[0]).to.not.haveOwnProperty(
      'created_by'
    );
  });
  it('returns modified comment with belongs_to property renamed to article_id key', () => {
    expect(formatComments(testComment, testRef)[0]).to.haveOwnProperty(
      'article_id'
    );
    expect(formatComments(testComment, testRef)[0]).to.not.haveOwnProperty(
      'belongs_to'
    );
  });
  it('returns modified comment with article_id value changed', () => {
    expect(formatComments(testComment, testRef)[0].article_id).to.equal(1);
  });
  it('returns created_at value converted to date object', () => {
    expect(formatComments(testComment, testRef)[0].created_at instanceof Date)
      .to.be.true;
  });
  it('returns a formatted array of comment objects', () => {
    let multiTestComment = [
      {
        body:
          "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
        belongs_to: "They're not exactly dogs, are they?",
        created_by: 'butter_bridge',
        votes: 16,
        created_at: 1511354163389
      },
      {
        body:
          'The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.',
        belongs_to: 'Living in the shadow of a great man',
        created_by: 'butter_bridge',
        votes: 14,
        created_at: 1479818163389
      }
    ];
    let newTestRef = {
      "They're not exactly dogs, are they?": 1,
      'Living in the shadow of a great man': 2
    };
    expect(formatComments(multiTestComment, newTestRef)[1]).to.haveOwnProperty(
      'article_id'
    );
    expect(
      formatComments(multiTestComment, newTestRef)[1].created_at instanceof Date
    ).to.be.true;
    expect(
      formatComments(multiTestComment, newTestRef)[1]
    ).to.not.haveOwnProperty('created_by');
  });
});
