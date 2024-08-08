const PlaidConnectInstructions = () => {
  return (
    <>
      <p className="text-lg font-semibold mb-4">Instructions</p>
        <ol className="list-decimal list-inside space-y-2">
          <li>Click the add/link account button</li>
          <li>Continue to Plaid</li>
          <li>Choose a financial institution</li>
          <li>If prompted to "Enter your credentials":</li>
          <ul className="list-disc list-inside ml-6 space-y-1">
            <li><strong>Online ID:</strong> user_good</li>
            <li><strong>Password:</strong> pass_good</li>
          </ul>
          <li>Otherwise, continue to login</li>
          <li>Click sign in, confirm, get code, submit, etc., without filling in any additional info</li>
          <li>Choose card or checking accounts to share and continue</li>
        </ol>
    </>
  )
}

export default PlaidConnectInstructions;