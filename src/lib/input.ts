import readline from 'node:readline';

/**
 * An async wrapper for readline question interface
 * @param {string} question the question to ask the user
 * @returns {Promise<string>} the user's response
 */
async function getUserInput(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const answer: string = await new Promise((resolve) => {
    rl.question(`${question} `, (input) => {
        if (typeof input === "string") resolve(input);
        else resolve("");
    });
  });

  rl.close();

  return answer;
}

/**
 * Requires that the user type "yes" or "y" to continue, otherwise throws an error
 * 
 * @param {string} prompt the prompt to show to the user
 * @returns {Promise<null>} 
 * @throws if the user responds anything other than "yes" or "y"
*/
async function requireYes(prompt: string): Promise<null> {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
  
    console.log(prompt);
    await new Promise((resolve) => {
      rl.question(`Please type "yes" or "y" to continue: `, (input = "") => {
          const sanitizedInput = input.replaceAll("\"", "").replaceAll("'", "").toLowerCase();
          if (sanitizedInput === "yes" || sanitizedInput === "y") resolve(true);
          else {
            throw new Error('A response of "yes" is required to continue');
          }
      });
    });
  
    rl.close();
  
    return null;
  }


export {
    getUserInput,
    requireYes
};