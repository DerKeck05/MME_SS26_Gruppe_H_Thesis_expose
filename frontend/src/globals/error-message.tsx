function ErrorMessage({message}: {message: string}) {
    return (
        <div className={"error-box"}>
            {message}
        </div>
    );
}

export default ErrorMessage;