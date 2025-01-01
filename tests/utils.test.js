import { formatDate, sanitizeInput, trimInput } from '../src/utils/helpers';

describe('formatDate', () => {
    it('should correctly format a valid ISO date string to MM/DD/YYYY', () => {
        const dateString = '2024-03-15T10:00:00Z';
        const formattedDate = formatDate(dateString);
        expect(formattedDate).toBe('03/15/2024');
    });

    it('should return null for an invalid date string', () => {
        const dateString = 'invalid-date-string';
        const formattedDate = formatDate(dateString);
        expect(formattedDate).toBeNull();
    });

    it('should return null for an empty date string', () => {
         const dateString = '';
        const formattedDate = formatDate(dateString);
        expect(formattedDate).toBeNull();
    });
    it('should return null for null input', () => {
         const dateString = null;
        const formattedDate = formatDate(dateString);
         expect(formattedDate).toBeNull();
    });
     it('should return null for undefined input', () => {
         const dateString = undefined;
         const formattedDate = formatDate(dateString);
         expect(formattedDate).toBeNull();
    });
    it('should return null for a date with incorrect format', () => {
        const dateString = '2024/03/15';
        const formattedDate = formatDate(dateString);
        expect(formattedDate).toBeNull();
    });
     it('should return null if the date is not valid', () => {
      const dateString = '2024-02-30T10:00:00Z'; // February 30 is not a valid date
      const formattedDate = formatDate(dateString);
         expect(formattedDate).toBeNull();
    });
    it('should handle dates with different times', () => {
      const dateString = '2024-03-15T20:30:45Z';
      const formattedDate = formatDate(dateString);
      expect(formattedDate).toBe('03/15/2024');
    });
    it('should handle date strings with leading/trailing whitespace', () => {
        const dateString = '   2024-03-15T10:00:00Z   ';
      const formattedDate = formatDate(dateString);
        expect(formattedDate).toBe('03/15/2024');
    });
});

describe('sanitizeInput', () => {
    it('should remove potentially harmful characters from a string', () => {
        const inputString = '<script>evil</script>"\'&--test<>input"\'&--';
        const sanitizedString = sanitizeInput(inputString);
       expect(sanitizedString).toBe('testinput');
    });

     it('should handle strings with no harmful characters', () => {
        const inputString = 'This is a safe string';
        const sanitizedString = sanitizeInput(inputString);
       expect(sanitizedString).toBe('This is a safe string');
    });

      it('should return an empty string for non string input', () => {
        const inputString = 1234;
        const sanitizedString = sanitizeInput(inputString);
        expect(sanitizedString).toBe('');
    });
    it('should return an empty string for null input', () => {
      const inputString = null;
        const sanitizedString = sanitizeInput(inputString);
      expect(sanitizedString).toBe('');
    });
    it('should return an empty string for undefined input', () => {
         const inputString = undefined;
        const sanitizedString = sanitizeInput(inputString);
       expect(sanitizedString).toBe('');
   });
   it('should handle strings with spaces', () => {
        const inputString = '  test input  ';
        const sanitizedString = sanitizeInput(inputString);
        expect(sanitizedString).toBe('test input');
   });
      it('should handle multiple occurrences of harmful characters', () => {
      const inputString = '<<>>"\'&--<script>evil</script>"\'&--test"\'&--';
       const sanitizedString = sanitizeInput(inputString);
      expect(sanitizedString).toBe('test');
    });
    it('should handle strings with unicode characters', () => {
       const inputString = '你好<script>evil</script>';
        const sanitizedString = sanitizeInput(inputString);
        expect(sanitizedString).toBe('你好');
    });
    it('should handle empty strings', () => {
        const inputString = '';
        const sanitizedString = sanitizeInput(inputString);
       expect(sanitizedString).toBe('');
    });
});


describe('trimInput', () => {
    it('should remove leading and trailing spaces from a string', () => {
        const inputString = '   test string   ';
        const trimmedString = trimInput(inputString);
        expect(trimmedString).toBe('test string');
    });

    it('should return an empty string if input is not a string', () => {
        const input = 1234;
        const trimmedString = trimInput(input);
        expect(trimmedString).toBe('');
    });
    it('should return an empty string for null input', () => {
      const inputString = null;
       const trimmedString = trimInput(inputString);
        expect(trimmedString).toBe('');
    });
    it('should return an empty string for undefined input', () => {
      const inputString = undefined;
       const trimmedString = trimInput(inputString);
         expect(trimmedString).toBe('');
    });
    it('should handle strings with no spaces', () => {
        const inputString = 'teststring';
        const trimmedString = trimInput(inputString);
         expect(trimmedString).toBe('teststring');
    });
     it('should handle an empty string', () => {
        const inputString = '';
        const trimmedString = trimInput(inputString);
        expect(trimmedString).toBe('');
    });
    it('should handle strings with only spaces', () => {
      const inputString = '   ';
        const trimmedString = trimInput(inputString);
        expect(trimmedString).toBe('');
   });
     it('should not modify a string that is already trimmed', () => {
        const inputString = 'already trimmed';
        const trimmedString = trimInput(inputString);
       expect(trimmedString).toBe('already trimmed');
    });
});