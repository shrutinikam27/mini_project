import Image from 'next/image';

type Props = {
    question: string;
};

export const QuestionBubble = ({ question }: Props) => {
    return (
        <div className="flex items-center gap-x-5 mb-8">
            <Image src="/logo1.png" alt="mascot"
                height={60} width={60} className="hidden lg:block" />

            <Image src="/logo1.png" alt="mascot"
                height={40} width={40} className="block lg:hidden" />

            <div className="relative py-3 px-5 border-2 rounded-xl text-base lg:text-lg">
                {question}
                <div className="absolute -left-3 top-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 transform -translate-y-1/2 rotate-90" />
            </div>
        </div>
    );
};
