# Helper script to filter the word list into seperate files.

def extract_words_by_length(input_file, output_files):
    # Initialize empty lists for each length
    word_lists = {length: [] for length in range(3, 8)}

    # Read words from the input file and categorize by length
    with open(input_file, 'r') as file:
        for line in file:
            words = line.strip().split()
            for word in words:
                length = len(word)
                if length in word_lists:
                    word_lists[length].append(word)

    # Write categorized words into separate files
    for length, words in word_lists.items():
        with open(output_files[length], 'w') as file:
            file.write('\n'.join(words))


if __name__ == "__main__":
    input_file = "google-10000-english-no-swears.txt"
    output_files = {
        3: "3_letter_words.txt",
        4: "4_letter_words.txt",
        5: "5_letter_words.txt",
        6: "6_letter_words.txt",
        7: "7_letter_words.txt"
    }

    extract_words_by_length(input_file, output_files)