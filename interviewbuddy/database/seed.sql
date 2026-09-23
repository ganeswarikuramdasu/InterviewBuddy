-- ============================================================
-- InterviewBuddy Seed Data (PostgreSQL)
-- The database connection/database is chosen by the client (psql / docker
-- entrypoint), so there is no "USE database" statement here.
-- ============================================================
-- USERS
-- NOTE: Demo users (admin@interviewbuddy.com / user@interviewbuddy.com etc.) are NOT
-- inserted here. They are created automatically on first application
-- startup by backend/.../config/DataInitializer.java, which hashes the
-- demo password "Passw0rd!" with the real BCryptPasswordEncoder bean used
-- by the app (avoids shipping a hand-computed/possibly-wrong hash in SQL).
-- See README "Demo Credentials" section.
-- ============================================================

-- ============================================================
-- CRT CATEGORIES
-- ============================================================
INSERT INTO crt_categories (name, display_name, description) VALUES
('APTITUDE', 'Aptitude', 'Quantitative aptitude topics frequently asked in campus placements'),
('REASONING', 'Reasoning', 'Logical and analytical reasoning topics'),
('VERBAL', 'Verbal', 'Verbal ability and English language topics');

-- ============================================================
-- CRT TOPICS - APTITUDE (category_id = 1)
-- ============================================================
INSERT INTO crt_topics (category_id, title, explanation, concepts, formulas, examples, tips, display_order) VALUES
(1, 'Percentages', 'Percentage represents a number as a fraction of 100. It is widely used to compare ratios and measure change.', 'Percentage increase/decrease, percentage of a quantity, converting fractions to percentages', 'Percentage = (Value / Total) x 100', 'If a student scores 45 out of 50, percentage = (45/50)*100 = 90%', 'Always convert percentage change problems into fractions first to avoid calculation errors.', 1),
(1, 'Profit and Loss', 'Profit and Loss problems deal with cost price, selling price and the gain or loss made in a transaction.', 'Cost Price (CP), Selling Price (SP), Profit %, Loss %, Marked Price, Discount', 'Profit % = ((SP-CP)/CP)*100, Loss % = ((CP-SP)/CP)*100', 'CP = 200, SP = 250 => Profit = 50, Profit% = 25%', 'Always compute profit/loss with respect to Cost Price unless stated otherwise.', 2),
(1, 'Simple Interest', 'Simple Interest is the interest calculated only on the principal amount.', 'Principal, Rate, Time, Interest', 'SI = (P x R x T) / 100', 'P=1000, R=5%, T=2 years => SI = 100', 'Simple interest grows linearly over time, unlike compound interest.', 3),
(1, 'Compound Interest', 'Compound Interest is calculated on the principal and also on the accumulated interest of previous periods.', 'Principal, Rate, Time, Compounding frequency', 'A = P(1 + R/100)^T, CI = A - P', 'P=1000, R=10%, T=2 => A=1210, CI=210', 'Compare CI vs SI problems by first finding the amount A.', 4),
(1, 'Ratio and Proportion', 'Ratio compares two quantities of the same kind; proportion states that two ratios are equal.', 'Ratio, Proportion, Mean Proportion, Continued Proportion', 'a:b = c:d means a/b = c/d', 'If 2:3 = x:9, then x = 6', 'Cross-multiply to solve proportion equations quickly.', 5),
(1, 'Averages', 'Average is the sum of all observations divided by the number of observations.', 'Mean, Weighted Average', 'Average = Sum of terms / Number of terms', 'Average of 4, 8, 12 = 24/3 = 8', 'Use the concept of deviation from assumed mean for faster calculation.', 6),
(1, 'Time and Work', 'Time and Work problems evaluate how long it takes for individuals or groups to complete a task.', 'Work rate, combined work, efficiency', 'If A does work in x days, A''s 1 day work = 1/x', 'A finishes in 10 days, B in 15 days; together = 1/10+1/15 = 1/6 => 6 days', 'Convert everyone''s work into "work per day" before combining.', 7),
(1, 'Time, Speed and Distance', 'Relates the distance travelled, speed of travel, and time taken.', 'Speed, Relative speed, Average speed', 'Speed = Distance / Time', 'Distance=120km, Speed=60km/h => Time=2h', 'For relative speed in opposite directions, add speeds; in same direction, subtract.', 8),
(1, 'Probability', 'Probability measures the likelihood of an event occurring.', 'Sample space, favorable outcomes, independent/dependent events', 'P(Event) = Favorable outcomes / Total outcomes', 'Probability of getting a head in a coin toss = 1/2', 'Always double check whether events are independent before multiplying probabilities.', 9),
(1, 'Permutations and Combinations', 'Counting techniques for arrangement (permutation) and selection (combination) of items.', 'nPr, nCr, factorial', 'nPr = n!/(n-r)!, nCr = n!/(r!(n-r)!)', '5P2 = 20, 5C2 = 10', 'Use permutation when order matters, combination when it does not.', 10),
(1, 'Number System', 'Deals with properties of integers, divisibility, LCM, HCF and remainders.', 'Divisibility rules, LCM, HCF, prime numbers', 'HCF x LCM = Product of two numbers', 'HCF(12,18)=6, LCM(12,18)=36', 'Memorize divisibility rules for 2,3,4,5,6,8,9,11 to save time.', 11),
(1, 'Ages', 'Problems involving present, past or future ages of individuals using linear equations.', 'Linear equations, ratio of ages', 'Present age relations expressed algebraically', 'If father is 3x and son is x, and sum=48, then x=12, ages are 36 and 12', 'Represent unknown ages using a single variable ratio to simplify equations.', 12);

-- ============================================================
-- CRT TOPICS - REASONING (category_id = 2)
-- ============================================================
INSERT INTO crt_topics (category_id, title, explanation, concepts, formulas, examples, tips, display_order) VALUES
(2, 'Number Series', 'Identify the pattern/logic in a sequence of numbers to find the missing or next term.', 'Arithmetic series, geometric series, difference patterns', 'Look for common difference or ratio between terms', '2, 4, 8, 16, ? => 32 (each term doubles)', 'Check differences, then differences of differences, then ratios.', 1),
(2, 'Coding-Decoding', 'Letters or numbers are coded using a defined logic; you must decode or apply the same logic.', 'Letter shifting, substitution', 'Shift each letter by a fixed number of positions in the alphabet', 'If CAT is coded as DBU, each letter is shifted by +1', 'Write out the alphabet with position numbers to solve shifting problems quickly.', 2),
(2, 'Blood Relations', 'Determine the relationship between people based on given family statements.', 'Family tree, generation mapping', 'Draw a family tree diagram to track relations', 'A is B''s father, B is C''s sister => A is C''s father', 'Always draw a quick diagram; do not rely purely on mental tracking.', 3),
(2, 'Direction Sense', 'Determine final direction or distance after a series of movements.', 'Compass directions, Pythagoras for shortest distance', 'Use x-y coordinate movement to track position', 'Walk 3km North then 4km East => shortest distance = 5km (3-4-5 triangle)', 'Plot movements on a simple grid to avoid direction confusion.', 4),
(2, 'Syllogisms', 'Determine whether a conclusion logically follows from given statements using set logic.', 'All, Some, No statements, Venn diagrams', 'Use Venn diagram overlap to test conclusions', 'All cats are animals; some animals are dogs -> conclusion about cats and dogs cannot be determined', 'Draw Venn diagrams for each statement before evaluating conclusions.', 5),
(2, 'Analogies', 'Identify the relationship between a pair of words/numbers and apply it to another pair.', 'Relationship types: synonym, antonym, part-whole, cause-effect', 'Identify the relationship type first, then apply consistently', 'Doctor:Hospital :: Teacher:? => School', 'Classify the relationship type before choosing the answer.', 6),
(2, 'Seating Arrangement', 'Arrange people around a table or in a row based on given conditions.', 'Linear arrangement, circular arrangement', 'Use positional slots and eliminate based on constraints', 'If A sits two seats left of B in a circle of 6, map positions numerically', 'Start with the most restrictive clue first when arranging.', 7),
(2, 'Puzzles', 'Multi-condition logical puzzles requiring deduction across several clues.', 'Grid-based deduction, elimination method', 'Tabulate all clues in a grid and eliminate impossible options', 'Assign people to houses/colors using elimination grids', 'Use a matrix/grid to track possibilities and cross off eliminated options.', 8),
(2, 'Data Sufficiency', 'Determine whether given statements provide enough information to answer a question.', 'Statement I alone, Statement II alone, both together, neither', 'Evaluate each statement independently before combining', 'Question: Is x > 5? Statement I: x > 3. Statement II: x = 7. Statement II alone is sufficient.', 'Never combine statements until you have tested each one individually.', 9),
(2, 'Logical Reasoning', 'General logical deduction problems including statements, arguments and inferences.', 'Deductive reasoning, cause-effect, assumptions', 'Identify explicit vs implicit assumptions', 'Statement: "All employees must wear ID cards." Inference validity depends on context given.', 'Distinguish between what is stated and what is merely implied.', 10);

-- ============================================================
-- CRT TOPICS - VERBAL (category_id = 3)
-- ============================================================
INSERT INTO crt_topics (category_id, title, explanation, concepts, formulas, examples, tips, display_order) VALUES
(3, 'Grammar', 'Covers rules of English grammar including tenses, subject-verb agreement and articles.', 'Tenses, subject-verb agreement, articles, prepositions', 'Subject-Verb agreement: singular subject takes singular verb', '"He go to school" is incorrect; correct form is "He goes to school"', 'Read the full sentence before choosing corrections; context changes tense choice.', 1),
(3, 'Sentence Correction', 'Identify and correct grammatical errors within a given sentence.', 'Error identification, sentence restructuring', 'Check tense consistency, agreement, and word order', '"She don''t like it" -> "She doesn''t like it"', 'Read the sentence aloud mentally to catch awkward phrasing.', 2),
(3, 'Vocabulary', 'Building word knowledge to understand and use words correctly in context.', 'Word meanings, contextual usage', 'Use root words and prefixes/suffixes to infer meaning', '"Benevolent" means kind and generous', 'Learn common Latin/Greek roots to decode unfamiliar words.', 3),
(3, 'Synonyms', 'Words that have the same or nearly the same meaning.', 'Contextual synonym matching', 'Match meaning, not just part of speech', 'Synonym of "Happy" is "Joyful"', 'Consider the shade of meaning; not all synonyms fit every context.', 4),
(3, 'Antonyms', 'Words that have the opposite meaning of a given word.', 'Contextual antonym matching', 'Identify direct opposite in meaning', 'Antonym of "Brave" is "Cowardly"', 'Watch for words with multiple meanings which can have different antonyms.', 5),
(3, 'Reading Comprehension', 'Understanding and answering questions based on a given passage.', 'Main idea, inference, tone, detail-based questions', 'Skim for structure, then read questions before re-reading details', 'Identify the author''s tone and main argument before answering inference questions.', 'Read the questions first so you know what to look for while reading the passage.', 6),
(3, 'Para Jumbles', 'Rearranging jumbled sentences into a coherent, logical paragraph.', 'Logical sequencing, transition words', 'Identify the opening and closing sentences first', 'A sentence with a pronoun like "This" usually cannot be the opening line', 'Look for linking words (however, therefore, this) to determine sentence order.', 7),
(3, 'Fill in the Blanks', 'Select the most appropriate word(s) to complete a sentence grammatically and contextually.', 'Contextual fit, grammatical fit', 'Consider both grammar and meaning when selecting the answer', '"She ___ to the market yesterday." -> "went"', 'Eliminate options that are grammatically incorrect before considering meaning.', 8);

-- ============================================================
-- CRT QUESTIONS (sample set per topic - Aptitude topics 1-3, Reasoning 13-14, Verbal 23-24)
-- ============================================================
INSERT INTO crt_questions (topic_id, category_id, question_text, option_a, option_b, option_c, option_d, correct_option, explanation, difficulty) VALUES
(1, 1, 'What is 25% of 480?', '100', '120', '110', '90', 'B', '25% of 480 = (25/100)*480 = 120.', 'EASY'),
(1, 1, 'A number is increased by 20% and then decreased by 20%. What is the net change?', 'No change', '4% decrease', '4% increase', '20% decrease', 'B', 'Net change = -(20*20)/100 = -4%, i.e. a 4% decrease.', 'MEDIUM'),
(1, 1, 'If 40% of a number is 80, what is the number?', '160', '200', '180', '220', 'B', '40% of x = 80 => x = 80/0.40 = 200.', 'EASY'),
(2, 1, 'A shopkeeper buys an item for 500 and sells it for 650. What is his profit percentage?', '25%', '30%', '20%', '35%', 'B', 'Profit% = ((650-500)/500)*100 = 30%.', 'EASY'),
(2, 1, 'A man sells an article at a loss of 10%. If he had sold it for 60 more, he would have gained 5%. Find the cost price.', '400', '450', '500', '350', 'A', 'Let CP = x. 0.95x - 0.90x = 60 => 0.05x = 60 => x = 400. Wait recompute: 1.05x-0.90x=0.15x=60 => x=400.', 'MEDIUM'),
(2, 1, 'Marked price of an item is 1000. After a 20% discount, what is the selling price?', '800', '820', '780', '850', 'A', 'Selling Price = 1000 - (20% of 1000) = 800.', 'EASY'),
(3, 1, 'Find the simple interest on 2000 at 5% per annum for 3 years.', '300', '250', '350', '400', 'A', 'SI = (2000*5*3)/100 = 300.', 'EASY'),
(3, 1, 'In how many years will a sum of 1000 become 1400 at 10% simple interest per annum?', '3 years', '4 years', '5 years', '6 years', 'B', 'SI = 400, T = (SI*100)/(P*R) = (400*100)/(1000*10) = 4 years.', 'MEDIUM'),
(13, 2, 'Find the next number in the series: 3, 6, 12, 24, ?', '30', '36', '48', '42', 'C', 'Each term is double the previous term: 24*2 = 48.', 'EASY'),
(13, 2, 'Find the missing number: 7, 14, 28, 56, ?', '84', '112', '100', '96', 'B', 'Each term doubles the previous one: 56*2=112.', 'EASY'),
(14, 2, 'If in a certain code, TIGER is written as UJHFS, how is LION written?', 'MJPO', 'MJOO', 'MKPO', 'MJPP', 'A', 'Each letter is shifted forward by 1: L->M, I->J, O->P, N->O => MJPO.', 'MEDIUM'),
(23, 3, 'Choose the correct sentence.', 'He don''t like coffee.', 'He doesn''t likes coffee.', 'He doesn''t like coffee.', 'He not like coffee.', 'C', '"Doesn''t" is used with third person singular followed by base verb "like".', 'EASY'),
(24, 3, 'Choose the sentence with the correct grammar.', 'Neither of the boys were present.', 'Neither of the boys was present.', 'Neither of the boys are present.', 'Neither of the boy was present.', 'B', '"Neither" is singular and takes a singular verb "was".', 'MEDIUM');

-- ============================================================
-- CRT TESTS
-- ============================================================
INSERT INTO crt_tests (category_id, title, description, duration_minutes, difficulty, is_published) VALUES
(1, 'Aptitude Foundations Test', 'A quick test covering percentages, profit-loss and simple interest.', 15, 'EASY', TRUE),
(2, 'Reasoning Basics Test', 'A quick test covering number series and coding-decoding.', 10, 'EASY', TRUE);

INSERT INTO crt_test_questions (test_id, question_id, display_order) VALUES
(1, 1, 1), (1, 2, 2), (1, 3, 3), (1, 4, 4), (1, 5, 5), (1, 6, 6), (1, 7, 7), (1, 8, 8),
(2, 9, 1), (2, 10, 2), (2, 11, 3);

-- ============================================================
-- CODING SHEETS & PATTERNS
-- ============================================================
INSERT INTO coding_sheets (name, slug, description, position) VALUES
('Neetcode 150', 'neetcode-150', 'The definitive 150-problem roadmap covering all core DSA patterns.', 1),
('Blind 75', 'blind-75', 'The classic 75 problems covering the highest-frequency interview topics.', 2);

INSERT INTO coding_patterns (name, slug, description, position) VALUES
('Arrays & Hashing', 'arrays-hashing', 'Array manipulation, hashing, and frequency counting patterns.', 1),
('Linked List', 'linked-list', 'Pointer manipulation, fast-slow, and reversal patterns.', 2),
('Stack', 'stack', 'Monotonic stack and LIFO-based traversal patterns.', 3),
('Binary Search', 'binary-search', 'Divide-and-conquer search on sorted ranges.', 4),
('Dynamic Programming', 'dynamic-programming', 'State definitions, memoization, and tabulation.', 5),
('Two Pointers', 'two-pointers', 'Left/right pointer traversal and sorted-array solving patterns.', 6),
('Sliding Window', 'sliding-window', 'Fixed and variable-size window traversal over arrays/strings.', 7),
('Trees', 'trees', 'Binary tree traversals, DFS/BFS and tree properties.', 8),
('Tries', 'tries', 'Prefix-tree data structures for efficient string operations.', 9),
('Heap / Priority Queue', 'heap-priority-queue', 'Priority-based selection, k-largest/smallest and scheduling.', 10),
('Backtracking', 'backtracking', 'Constraint-based exhaustive search with pruning.', 11),
('Graphs', 'graphs', 'BFS, DFS, topological sort and connectivity on graphs.', 12),
('Advanced Graphs', 'advanced-graphs', 'Shortest paths, MST, Euler paths and flow on graphs.', 13),
('1-D Dynamic Programming', '1-d-dynamic-programming', 'Single-state dynamic programming (memoization/tabulation).', 14),
('2-D Dynamic Programming', '2-d-dynamic-programming', 'Multi-dimensional state dynamic programming.', 15),
('Greedy', 'greedy', 'Locally optimal choices that give a globally optimal result.', 16),
('Intervals', 'intervals', 'Scheduling and interval merging problems.', 17),
('Math & Geometry', 'math-geometry', 'Number theory, matrix manipulation and geometric problems.', 18),
('Bit Manipulation', 'bit-manipulation', 'Bit-level operations: masks, shifts and XOR tricks.', 19);

-- ============================================================
-- CODING PROBLEMS
-- NOTE: To stay in sync with the live catalog, the full
--       Neetcode 150 + Blind 75 dataset (151 problems with exact
--       sheet memberships) is maintained separately in
--       database/neetcode_seed_mysql.sql. Run it AFTER this file:
--       it retags the patterns below, inserts the remaining
--       problems, links every problem to its sheets through
--       coding_sheet_problems, and drops the legacy sheet_id column.
-- ============================================================
INSERT INTO coding_problems (title, slug, description, constraints_text, difficulty, topic, pattern_id, external_url, platform, is_published) VALUES
('Two Sum', 'two-sum',
 'Given an array of integers nums and an integer target, return the indices of the two numbers such that they add up to target. Assume exactly one solution exists and you may not use the same element twice.',
 '2 <= nums.length <= 10^4
-10^9 <= nums[i] <= 10^9
-10^9 <= target <= 10^9',
 'EASY', 'Arrays', 1,
 'https://leetcode.com/problems/two-sum/', 'LEETCODE',
 TRUE),
('Reverse Linked List', 'reverse-linked-list',
 'Given the head of a singly linked list, reverse the list and return the reversed list''s head.',
 '0 <= number of nodes <= 5000
-5000 <= Node.val <= 5000',
 'MEDIUM', 'Linked Lists', 2,
 'https://leetcode.com/problems/reverse-linked-list/', 'LEETCODE',
 TRUE),
('Valid Parentheses', 'valid-parentheses',
 'Given a string s containing just the characters (){}[], determine if the input string is valid, i.e. every opening bracket is closed by the same type in the correct order.',
 '1 <= s.length <= 10^4',
 'EASY', 'Stack', 3,
 'https://leetcode.com/problems/valid-parentheses/', 'LEETCODE',
 TRUE),
('Binary Search', 'binary-search',
 'Given a sorted array of integers nums and a target value, return the index of target if it exists, otherwise return -1. Must run in O(log n) time.',
 '1 <= nums.length <= 10^4
nums is sorted in ascending order',
 'EASY', 'Binary Search', 4,
 'https://leetcode.com/problems/binary-search/', 'LEETCODE',
 TRUE),
('Longest Increasing Subsequence', 'longest-increasing-subsequence',
 'Given an integer array nums, return the length of the longest strictly increasing subsequence.',
 '1 <= nums.length <= 2500',
 'HARD', 'Dynamic Programming', 14,
 'https://leetcode.com/problems/longest-increasing-subsequence/', 'LEETCODE',
 TRUE),
('Best Time to Buy and Sell Stock', 'best-time-to-buy-and-sell-stock',
 'You are given an array prices where prices[i] is the price of a given stock on the ith day. Choose a single day to buy and a later day to sell to maximize profit, or return 0 if no profit is possible.',
 '1 <= prices.length <= 10^5
0 <= prices[i] <= 10^4',
 'EASY', 'Arrays', 7,
 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/', 'LEETCODE',
 TRUE);

-- Sheet links for the base problems (both belong to Neetcode 150; the Blind 75
-- subset is assigned by neetcode_seed_mysql.sql).
INSERT INTO coding_sheet_problems (sheet_id, problem_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6),
(2, 1), (2, 2), (2, 3), (2, 5), (2, 6);

INSERT INTO coding_examples (problem_id, input_text, output_text, explanation, display_order) VALUES
(1, 'nums = [2,7,11,15], target = 9', '[0,1]', 'nums[0] + nums[1] = 2 + 7 = 9', 1),
(1, 'nums = [3,2,4], target = 6', '[1,2]', 'nums[1] + nums[2] = 2 + 4 = 6', 2),
(3, 's = "()[]{}"', 'true', 'Every bracket type is properly closed in order.', 1),
(3, 's = "(]"', 'false', 'Brackets are mismatched.', 2),
(4, 'nums = [-1,0,3,5,9,12], target = 9', '4', '9 exists at index 4.', 1);

INSERT INTO test_cases (problem_id, input_data, expected_output, is_sample, display_order) VALUES
(1, '[2,7,11,15]
9', '[0,1]', TRUE, 1),
(1, '[3,2,4]
6', '[1,2]', TRUE, 2),
(1, '[3,3]
6', '[0,1]', FALSE, 3),
(3, '()[]{}', 'true', TRUE, 1),
(3, '(]', 'false', TRUE, 2),
(3, '([)]', 'false', FALSE, 3),
(4, '[-1,0,3,5,9,12]
9', '4', TRUE, 1),
(4, '[-1,0,3,5,9,12]
2', '-1', FALSE, 2);

-- ============================================================
-- INTERVIEW QUESTIONS
-- ============================================================
INSERT INTO interview_questions (role, interview_type, difficulty, question_text, model_answer_notes) VALUES
('Software Engineer', 'TECHNICAL', 'EASY', 'What is the difference between an array and a linked list?', 'Should cover memory layout, access time O(1) vs O(n), insertion/deletion cost.'),
('Software Engineer', 'TECHNICAL', 'MEDIUM', 'Explain how a HashMap works internally.', 'Should mention hashing, buckets, collision handling, load factor.'),
('Software Engineer', 'HR', 'EASY', 'Tell me about yourself.', 'Should be concise, relevant to the role, highlight strengths and goals.'),
('Software Engineer', 'HR', 'EASY', 'Why do you want to work with us?', 'Should show research about the company and alignment of values/goals.'),
('Java Developer', 'TECHNICAL', 'MEDIUM', 'Explain the difference between abstract classes and interfaces in Java.', 'Should cover multiple inheritance, default methods, use cases.'),
('Java Developer', 'TECHNICAL', 'MEDIUM', 'What is the difference between == and .equals() in Java?', 'Should cover reference comparison vs value comparison.'),
('Backend Developer', 'TECHNICAL', 'MEDIUM', 'What is the purpose of indexing in a database?', 'Should mention faster lookups, trade-off with write performance and storage.'),
('Backend Developer', 'TECHNICAL', 'HARD', 'How would you design a rate limiter for an API?', 'Should discuss token bucket / sliding window algorithms and distributed considerations.'),
('Full Stack Developer', 'MIXED', 'MEDIUM', 'How do you ensure a REST API is secure?', 'Should mention authentication, authorization, input validation, HTTPS.'),
('Data Analyst', 'TECHNICAL', 'EASY', 'What is the difference between a primary key and a foreign key?', 'Should cover uniqueness constraint vs referential integrity.'),
('ML Engineer', 'TECHNICAL', 'MEDIUM', 'What is overfitting and how do you prevent it?', 'Should mention regularization, cross-validation, more data, simpler models.');

-- ============================================================
-- LEARNING MODULE
-- ============================================================
INSERT INTO learning_categories (name, description, display_order) VALUES
('Java', 'Core Java and advanced concepts for interviews', 1),
('Spring Boot', 'Building REST APIs and enterprise applications with Spring Boot', 2),
('DSA', 'Data Structures and Algorithms fundamentals', 3),
('SQL', 'Structured Query Language for relational databases', 4),
('DBMS', 'Database Management System concepts', 5),
('Operating Systems', 'Core OS concepts commonly asked in interviews', 6),
('Computer Networks', 'Networking fundamentals for technical interviews', 7),
('OOP', 'Object Oriented Programming principles', 8),
('System Design', 'High-level and low-level system design concepts', 9),
('Interview Preparation', 'General interview strategy and soft skills', 10);

INSERT INTO learning_resources (category_id, title, description, resource_type, content_url, content_body, is_published) VALUES
(1, 'Java Collections Framework Overview', 'A structured walkthrough of List, Set, Map and their common implementations.', 'ARTICLE', NULL, 'The Java Collections Framework provides a unified architecture for storing and manipulating groups of objects. Key interfaces include List (ordered, duplicates allowed), Set (no duplicates), and Map (key-value pairs). Common implementations: ArrayList, LinkedList, HashSet, TreeSet, HashMap, TreeMap. Choose ArrayList for fast random access, LinkedList for frequent insertions/deletions, HashMap for O(1) average lookups, and TreeMap when sorted order is required.', TRUE),
(1, 'Understanding Java Multithreading', 'Notes covering threads, synchronization and the executor framework.', 'NOTES', NULL, 'Java threads can be created by extending Thread or implementing Runnable. Synchronization prevents race conditions using synchronized blocks/methods. The Executor framework (ExecutorService, ThreadPoolExecutor) is preferred over manual thread management for production code because it manages thread lifecycle and pooling efficiently.', TRUE),
(2, 'Building REST APIs with Spring Boot', 'A guide to controllers, services, and repositories in a layered Spring Boot application.', 'ARTICLE', NULL, 'Spring Boot applications are typically organized into controller, service, and repository layers. Controllers handle HTTP requests and delegate to services. Services contain business logic. Repositories (Spring Data JPA) handle persistence. This separation keeps code maintainable and testable.', TRUE),
(2, 'Spring Security with JWT', 'External reference for implementing stateless authentication using JWT in Spring Security.', 'EXTERNAL_LINK', 'https://docs.spring.io/spring-security/reference/index.html', NULL, TRUE),
(3, 'Big-O Complexity Explained', 'Notes on how to analyze time and space complexity of algorithms.', 'NOTES', NULL, 'Big-O notation describes the upper bound of an algorithm''s growth rate. Common complexities from fastest to slowest: O(1), O(log n), O(n), O(n log n), O(n^2), O(2^n). Always analyze loops and recursive calls to determine complexity.', TRUE),
(3, 'Introduction to Dynamic Programming', 'A conceptual introduction to memoization and tabulation techniques.', 'ARTICLE', NULL, 'Dynamic programming solves problems by breaking them into overlapping subproblems and storing results to avoid recomputation. Two approaches: top-down (memoization using recursion + cache) and bottom-up (tabulation using iterative arrays). Classic examples include Fibonacci, knapsack, and longest common subsequence.', TRUE),
(4, 'SQL Joins Explained', 'Covers INNER, LEFT, RIGHT and FULL OUTER joins with examples.', 'ARTICLE', NULL, 'INNER JOIN returns rows with matching values in both tables. LEFT JOIN returns all rows from the left table and matched rows from the right. RIGHT JOIN is the mirror of LEFT JOIN. FULL OUTER JOIN returns all rows when there is a match in either table (supported natively in PostgreSQL).', TRUE),
(5, 'Database Normalization (1NF to 3NF)', 'Notes explaining normal forms and why normalization reduces redundancy.', 'NOTES', NULL, '1NF requires atomic column values. 2NF requires no partial dependency on a composite key. 3NF requires no transitive dependency on non-key attributes. Normalization reduces data redundancy and update anomalies at the cost of additional joins.', TRUE),
(6, 'Process vs Thread', 'A short comparison of processes and threads in operating systems.', 'ARTICLE', NULL, 'A process is an independent execution unit with its own memory space, while a thread is a lightweight unit of execution within a process that shares memory with other threads of the same process. Context switching between threads is generally cheaper than between processes.', TRUE),
(7, 'TCP vs UDP', 'Notes comparing the two core transport layer protocols.', 'NOTES', NULL, 'TCP is connection-oriented, reliable, and ensures ordered delivery, making it suitable for web browsing and file transfer. UDP is connectionless, faster, and does not guarantee delivery order, making it suitable for streaming and gaming.', TRUE),
(8, 'Four Pillars of OOP', 'Encapsulation, Abstraction, Inheritance and Polymorphism explained with examples.', 'ARTICLE', NULL, 'Encapsulation bundles data and methods together and restricts direct access. Abstraction hides implementation details and exposes only relevant behavior. Inheritance allows a class to acquire properties of another class. Polymorphism allows objects to take multiple forms through method overriding/overloading.', TRUE),
(9, 'Designing a URL Shortener', 'A walkthrough of the high-level design considerations for a URL shortening service.', 'ARTICLE', NULL, 'Key considerations include: generating unique short codes (hashing or base62 counters), handling redirects with HTTP 301/302, database schema for mapping short-to-long URLs, and caching frequently accessed URLs for performance.', TRUE),
(10, 'STAR Method for Behavioral Interviews', 'Guidance on structuring behavioral interview answers using Situation, Task, Action, Result.', 'NOTES', NULL, 'The STAR method structures behavioral answers: Situation (context), Task (your responsibility), Action (what you did), Result (the outcome, ideally with measurable impact). This keeps answers concise and focused on your contribution.', TRUE);