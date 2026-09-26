export interface UIComment {
    content: string;
    createdAt: string;
    supervisorName: string;
}

function CommentItem(comment: UIComment) {
    return (
        <div className={"mb-(--spacing-medium) "}>
            <div
                className={"flex flex-col rounded-(--border-radius) h-auto p-(--spacing-medium) bg-(--night-blue)"}>
                <h4 className="text-base font-semibold tracking-wide text-(--secondary)">
                    {comment.supervisorName}
                </h4>

                <div className="mb-(--spacing-small) mt-(--spacing-small)">
                    <p className="text-(--white)">
                        {comment.content}
                    </p>
                </div>
            </div>

            <div className={"flex justify-end text-sm mt-1 opacity-60 text-(--dark-blue)"}>
                <p>{comment.createdAt}</p>
            </div>
        </div>
    );
}

export default CommentItem;