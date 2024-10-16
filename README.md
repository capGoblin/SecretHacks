# SecretHacks: A decentralized platform for fair, anonymous voting in hackathons and community funding.

## User-Focused Summary

SecretHacks is a decentralized platform designed to combat popularity bias and the bandwagon effect in grants, hackathons, and community funding initiatives. By leveraging encryption through the Secret Network, it ensures that participants can vote anonymously and securely, leading to fairer assessments of project quality. With SecretHacks, users can evaluate projects based on their true merit, resulting in a more equitable funding distribution.

## Investor Pitch

In many grant and hackathon systems, participants often vote based on **popularity bias** or follow the **bandwagon effect**, where projects with more visible support gain disproportionate attention. This results in skewed voting patterns and unfair competition. High-quality projects that not attract mass attention end up receiving **less funding from the matching pool** during Quadratic Voting/Funding, which unfairly limits their growth and potential impact.

By encrypting these votes, SecretHacks creates a private, unbiased, and fair voting environment, ensuring that funding distribution is based on project merit rather than popularity.

### Smart Contracts

The core of SecretHacks is built on the Secret Network, which provides privacy and encryption features. The main contract is written in Rust and can be found in the `voting-contract` directory. Key components include:

1. **Project Creation**: Users can create project proposals for hackathons. [View Code](https://github.com/capGoblin/SecretHacks/blob/eeb711859194264dcf0a0adf916bf182f4a73904/voting-contract/src/contract.rs#L76-L139)

2. **Voting Mechanism**: Implements the quadratic funding voting system. [View Code](https://github.com/capGoblin/SecretHacks/blob/eeb711859194264dcf0a0adf916bf182f4a73904/voting-contract/src/contract.rs#L141-L212)

3. **Query Functions (performed solely by the platform)**: Allow retrieval of proposal and voting information. [View Code](https://github.com/capGoblin/SecretHacks/blob/eeb711859194264dcf0a0adf916bf182f4a73904/voting-contract/src/contract.rs#L223-L272)

4. **Testing**: Comprehensive tests are implemented to ensure the functionality and security of the smart contracts [View Tests](https://github.com/capGoblin/SecretHacks/blob/eeb711859194264dcf0a0adf916bf182f4a73904/voting-contract/src/contract.rs#L285-L380)

### Frontend

The frontend is built using Next.js and can be found in the `app` directory. Key components include:

1. **Hackathon List**: Displays available hackathons. [View Code](https://github.com/capGoblin/SecretHacks/blob/main/app/page.tsx)

2. **Project Creation**: Allows users to submit new projects. [View Code](https://github.com/capGoblin/SecretHacks/blob/main/app/%5BhackathonId%5D/create-project/page.tsx)

3. **Voting Interface**: Enables users to vote for projects. [View Code](https://github.com/capGoblin/SecretHacks/blob/main/app/%5BhackathonId%5D/page.tsx)

## Contract and Function Interactions

1. **Project Creation**:

   - Frontend sends encrypted project data to the Secret Network via SecretPath from an EVM chain.
   - The Secret Network contract stores the project information securely.

2. **Voting Process**:

   - Users select projects and allocate votes.
   - Frontend encrypts voting data and sends it to the Secret Network via SecretPath from an EVM chain.
   - The Secret Network contract processes votes and updates the project standings.

3. **Querying Results (performed solely by the platform)**:
   - The platform retrieves encrypted results from the Secret Network contract, ensuring that only authorized components can access the data.
   - Once the results are obtained, the platform decrypts the information and presents it to users, offering insights into project performance and funding distribution while maintaining data confidentiality.

## Design Choices

1. **Privacy-First Approach**: Utilizing Secret Network for enhanced privacy in voting and project submissions.

2. **Vote Encryption via Secret Network**: Ensures complete privacy and security for voters, protecting voter anonymity and preventing vote tampering.

3. **Cross-Chain Compatibility**: Seamlessly integrated with EVM chains, including SEI's EVM-compatible testnet with WalletConnect, improving accessibility across all EVM networks.

For more detailed information on the implementation, please refer to the code files in the `voting-contract` and `app` directories.

---

Feel free to reach out with any questions or feedback!
