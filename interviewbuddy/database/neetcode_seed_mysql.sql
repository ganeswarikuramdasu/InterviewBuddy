-- ============================================================
-- InterviewBuddy - NeetCode 150 + Blind 75 catalog (MySQL)
-- Adds the remaining NeetCode patterns and the full set of
-- Blnd 75 / NeetCode 150 problems with many-to-many sheet links.
-- Intended to run against the live `interviewbuddy` MySQL DB.
-- ============================================================

-- ---------- Patterns ----------
INSERT INTO coding_patterns (id, name, slug, description, position) VALUES
(6,  'Two Pointers',                  'two-pointers',                  'Left/right pointer traversal and sorted-array solving patterns.', 6),
(7,  'Sliding Window',                'sliding-window',                'Fixed and variable-size window traversal over arrays/strings.', 7),
(8,  'Trees',                         'trees',                         'Binary tree traversals, DFS/BFS and tree properties.', 8),
(9,  'Tries',                         'tries',                         'Prefix-tree data structures for efficient string operations.', 9),
(10, 'Heap / Priority Queue',         'heap-priority-queue',           'Priority-based selection, k-largest/smallest and scheduling.', 10),
(11, 'Backtracking',                  'backtracking',                  'Constraint-based exhaustive search with pruning.', 11),
(12, 'Graphs',                        'graphs',                        'BFS, DFS, topological sort and connectivity on graphs.', 12),
(13, 'Advanced Graphs',               'advanced-graphs',               'Shortest paths, MST, Euler paths and flow on graphs.', 13),
(14, '1-D Dynamic Programming',       '1-d-dynamic-programming',       'Single-state dynamic programming (memoization/tabulation).', 14),
(15, '2-D Dynamic Programming',       '2-d-dynamic-programming',       'Multi-dimensional state dynamic programming.', 15),
(16, 'Greedy',                        'greedy',                        'Locally optimal choices that give a globally optimal result.', 16),
(17, 'Intervals',                     'intervals',                     'Scheduling and interval merging problems.', 17),
(18, 'Math & Geometry',               'math-geometry',                 'Number theory, matrix manipulation and geometric problems.', 18),
(19, 'Bit Manipulation',              'bit-manipulation',              'Bit-level operations: masks, shifts and XOR tricks.', 19);

ALTER TABLE coding_patterns AUTO_INCREMENT = 20;

-- ---------- Retag the pre-existing problems ----------
UPDATE coding_problems SET pattern_id = 1  WHERE slug = 'two-sum';
UPDATE coding_problems SET pattern_id = 2  WHERE slug = 'reverse-linked-list';
UPDATE coding_problems SET pattern_id = 3  WHERE slug = 'valid-parentheses';
UPDATE coding_problems SET pattern_id = 4  WHERE slug = 'binary-search';
UPDATE coding_problems SET pattern_id = 14 WHERE slug = 'longest-increasing-subsequence';
UPDATE coding_problems SET pattern_id = 7, topic = 'Arrays' WHERE slug = 'best-time-to-buy-and-sell-stock';
UPDATE coding_problems SET is_published = TRUE WHERE id IN (1,2,3,4,5,6);

-- ============================================================
-- CODING PROBLEMS
-- ============================================================
INSERT INTO coding_problems (title, slug, description, constraints_text, difficulty, topic, pattern_id, external_url, platform, is_published) VALUES

-- ---------- Arrays & Hashing (pattern 1) ----------
('Contains Duplicate', 'contains-duplicate',
 'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.',
 '1 <= nums.length <= 10^5  -10^9 <= nums[i] <= 10^9',
 'EASY', 'Arrays', 1, 'https://leetcode.com/problems/contains-duplicate/', 'LEETCODE', TRUE),

('Valid Anagram', 'valid-anagram',
 'Given two strings s and t, return true if t is an anagram of s, otherwise false. An anagram is a word formed by rearranging the letters of another word.',
 '1 <= s.length, t.length <= 5 * 10^4',
 'EASY', 'Strings', 1, 'https://leetcode.com/problems/valid-anagram/', 'LEETCODE', TRUE),

('Group Anagrams', 'group-anagrams',
 'Given an array of strings strs, group the anagrams together. You may return the answer in any order.',
 '1 <= strs.length <= 10^4  0 <= strs[i].length <= 100',
 'MEDIUM', 'Strings', 1, 'https://leetcode.com/problems/group-anagrams/', 'LEETCODE', TRUE),

('Top K Frequent Elements', 'top-k-frequent-elements',
 'Given an integer array nums and an integer k, return the k most frequent elements. The answer may be returned in any order.',
 '1 <= nums.length <= 10^5  k is in the range [1, number of unique elements]',
 'MEDIUM', 'Arrays', 1, 'https://leetcode.com/problems/top-k-frequent-elements/', 'LEETCODE', TRUE),

('Product of Array Except Self', 'product-of-array-except-self',
 'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]. Must run in O(n) time without using the division operation.',
 '2 <= nums.length <= 10^5  -30 <= nums[i] <= 30',
 'MEDIUM', 'Arrays', 1, 'https://leetcode.com/problems/product-of-array-except-self/', 'LEETCODE', TRUE),

('Valid Sudoku', 'valid-sudoku',
 'Determine if a 9 x 9 Sudoku board is valid. Only the filled cells need to be validated according to the Sudoku rules: each row, column, and 3x3 box must contain the digits 1-9 without repetition.',
 'board.length == 9  board[i].length == 9',
 'MEDIUM', 'Arrays', 1, 'https://leetcode.com/problems/valid-sudoku/', 'LEETCODE', TRUE),

('Encode and Decode Strings', 'encode-and-decode-strings',
 'Design an algorithm to encode a list of strings to a single string, then decode that string back to the original list of strings.',
 '0 <= strs.length <= 100  0 <= strs[i].length <= 200',
 'MEDIUM', 'Strings', 1, 'https://leetcode.com/problems/encode-and-decode-strings/', 'LEETCODE', TRUE),

('Longest Consecutive Sequence', 'longest-consecutive-sequence',
 'Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence. Must run in O(n) time.',
 '0 <= nums.length <= 10^5',
 'MEDIUM', 'Arrays', 1, 'https://leetcode.com/problems/longest-consecutive-sequence/', 'LEETCODE', TRUE),

-- ---------- Two Pointers (pattern 6) ----------
('Valid Palindrome', 'valid-palindrome',
 'Given a string s, return true if it is a palindrome after converting all uppercase letters to lowercase and removing all non-alphanumeric characters.',
 '1 <= s.length <= 2 * 10^5',
 'EASY', 'Strings', 6, 'https://leetcode.com/problems/valid-palindrome/', 'LEETCODE', TRUE),

('Two Sum II - Input Array Is Sorted', 'two-sum-ii-input-array-is-sorted',
 'Given a 1-indexed sorted array of integers numbers and a target, return the indices of the two numbers that add up to target using constant extra space.',
 '2 <= numbers.length <= 3 * 10^4  -1000 <= numbers[i] <= 1000',
 'MEDIUM', 'Arrays', 6, 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/', 'LEETCODE', TRUE),

('3Sum', '3sum',
 'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0. The solution set must not contain duplicate triplets.',
 '3 <= nums.length <= 3000  -10^5 <= nums[i] <= 10^5',
 'MEDIUM', 'Arrays', 6, 'https://leetcode.com/problems/3sum/', 'LEETCODE', TRUE),

('Container With Most Water', 'container-with-most-water',
 'Given an integer array height of length n of vertical lines, find two lines that together with the x-axis form a container that holds the most water. Return the maximum amount of water.',
 'n == height.length  2 <= n <= 10^5',
 'MEDIUM', 'Arrays', 6, 'https://leetcode.com/problems/container-with-most-water/', 'LEETCODE', TRUE),

('Trapping Rain Water', 'trapping-rain-water',
 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
 'n == height.length  1 <= n <= 2 * 10^4  0 <= height[i] <= 10^5',
 'HARD', 'Arrays', 6, 'https://leetcode.com/problems/trapping-rain-water/', 'LEETCODE', TRUE),

-- ---------- Sliding Window (pattern 7) ----------
('Longest Substring Without Repeating Characters', 'longest-substring-without-repeating-characters',
 'Given a string s, return the length of the longest substring without repeating characters.',
 '0 <= s.length <= 5 * 10^4',
 'MEDIUM', 'Strings', 7, 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', 'LEETCODE', TRUE),

('Longest Repeating Character Replacement', 'longest-repeating-character-replacement',
 'Given a string s and an integer k, you may choose any character and change it to any other uppercase English character k times. Return the length of the longest substring containing the same letter you can get.',
 '1 <= s.length <= 10^5  s consists of uppercase English letters  0 <= k <= s.length',
 'MEDIUM', 'Strings', 7, 'https://leetcode.com/problems/longest-repeating-character-replacement/', 'LEETCODE', TRUE),

('Permutation in String', 'permutation-in-string',
 'Given two strings s1 and s2, return true if s2 contains a permutation of s1, otherwise false. In other words, return true if one of s1 permutations is a substring of s2.',
 '1 <= s1.length, s2.length <= 10^4',
 'MEDIUM', 'Strings', 7, 'https://leetcode.com/problems/permutation-in-string/', 'LEETCODE', TRUE),

('Minimum Window Substring', 'minimum-window-substring',
 'Given two strings s and t, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If no such window exists, return the empty string.',
 '1 <= s.length, t.length <= 10^5',
 'HARD', 'Strings', 7, 'https://leetcode.com/problems/minimum-window-substring/', 'LEETCODE', TRUE),

('Sliding Window Maximum', 'sliding-window-maximum',
 'Given an array nums and a sliding window of size k moving from left to right, return an array of the maximum values of each window.',
 '1 <= nums.length <= 10^5  -10^4 <= nums[i] <= 10^4  1 <= k <= nums.length',
 'HARD', 'Arrays', 7, 'https://leetcode.com/problems/sliding-window-maximum/', 'LEETCODE', TRUE),

-- ---------- Stack (pattern 3) ----------
('Min Stack', 'min-stack',
 'Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.',
 'Operations: push, pop, top, getMin in O(1) time.',
 'MEDIUM', 'Stack', 3, 'https://leetcode.com/problems/min-stack/', 'LEETCODE', TRUE),

('Evaluate Reverse Polish Notation', 'evaluate-reverse-polish-notation',
 'Evaluate an arithmetic expression in Reverse Polish Notation using valid operators + - * /. Each operand may be an integer or another expression and division truncates toward zero.',
 '1 <= tokens.length <= 10^4',
 'MEDIUM', 'Stack', 3, 'https://leetcode.com/problems/evaluate-reverse-polish-notation/', 'LEETCODE', TRUE),

('Generate Parentheses', 'generate-parentheses',
 'Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.',
 '1 <= n <= 8',
 'MEDIUM', 'Stack', 3, 'https://leetcode.com/problems/generate-parentheses/', 'LEETCODE', TRUE),

('Daily Temperatures', 'daily-temperatures',
 'Given an array of integers temperatures representing daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature.',
 '1 <= temperatures.length <= 10^5',
 'MEDIUM', 'Stack', 3, 'https://leetcode.com/problems/daily-temperatures/', 'LEETCODE', TRUE),

('Car Fleet', 'car-fleet',
 'There are n cars going to the same destination. A car that is behind a faster car will catch it. Return the number of car fleets that will arrive at the destination.',
 '1 <= n <= 10^5  0 < target < 10^6',
 'MEDIUM', 'Arrays', 3, 'https://leetcode.com/problems/car-fleet/', 'LEETCODE', TRUE),

('Largest Rectangle in Histogram', 'largest-rectangle-in-histogram',
 'Given an array of integers heights representing the histogram bar height, return the area of the largest rectangle that can be formed among the bars.',
 '1 <= heights.length <= 10^5  0 <= heights[i] <= 10^4',
 'HARD', 'Arrays', 3, 'https://leetcode.com/problems/largest-rectangle-in-histogram/', 'LEETCODE', TRUE),

-- ---------- Binary Search (pattern 4) ----------
('Search a 2D Matrix', 'search-a-2d-matrix',
 'You are given an m x n integer matrix with integers sorted in row-major order. Write an efficient algorithm that searches for a target value in the matrix.',
 'm == matrix.length  n == matrix[i].length  1 <= m, n <= 100',
 'MEDIUM', 'Arrays', 4, 'https://leetcode.com/problems/search-a-2d-matrix/', 'LEETCODE', TRUE),

('Koko Eating Bananas', 'koko-eating-bananas',
 'Koko can decide her bananas-per-hour eating speed. Return the minimum integer k such that she can eat all the bananas within h hours.',
 '1 <= piles.length <= 10^4  piles.length <= h <= 10^9',
 'MEDIUM', 'Binary Search', 4, 'https://leetcode.com/problems/koko-eating-bananas/', 'LEETCODE', TRUE),

('Search in Rotated Sorted Array', 'search-in-rotated-sorted-array',
 'Given a rotated sorted array of distinct integers and a target, return the index of target or -1 if not present. Must run in O(log n) time.',
 '1 <= nums.length <= 5000  -10^4 <= nums[i] <= 10^4',
 'MEDIUM', 'Binary Search', 4, 'https://leetcode.com/problems/search-in-rotated-sorted-array/', 'LEETCODE', TRUE),

('Find Minimum in Rotated Sorted Array', 'find-minimum-in-rotated-sorted-array',
 'Given a rotated sorted array of unique elements, return the minimum element of the array. Must run in O(log n) time.',
 '1 <= nums.length <= 5000  -5000 <= nums[i] <= 5000',
 'MEDIUM', 'Binary Search', 4, 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/', 'LEETCODE', TRUE),

('Time Based Key-Value Store', 'time-based-key-value-store',
 'Design a time-based key-value data structure that can store multiple values for the same key at different time stamps and retrieve the value stored at or before a given timestamp.',
 '1 <= key.length, value.length <= 100  Calls are made with strictly increasing timestamps.',
 'MEDIUM', 'Binary Search', 4, 'https://leetcode.com/problems/time-based-key-value-store/', 'LEETCODE', TRUE),

('Median of Two Sorted Arrays', 'median-of-two-sorted-arrays',
 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays. Must run in O(log(m+n)) time.',
 '0 <= m, n <= 1000  1 <= m + n <= 2000',
 'HARD', 'Arrays', 4, 'https://leetcode.com/problems/median-of-two-sorted-arrays/', 'LEETCODE', TRUE),

-- ---------- Linked List (pattern 2) ----------
('Merge Two Sorted Lists', 'merge-two-sorted-lists',
 'You are given the heads of two sorted linked lists. Merge the two lists into one sorted list and return the head of the merged list.',
 '0 <= number of nodes <= 50  -100 <= Node.val <= 100',
 'EASY', 'Linked Lists', 2, 'https://leetcode.com/problems/merge-two-sorted-lists/', 'LEETCODE', TRUE),

('Reorder List', 'reorder-list',
 'You are given the head of a singly linked list. Reorder the list to L0 -> Ln -> L1 -> Ln-1 -> L2 -> Ln-2 -> ... in place.',
 '1 <= number of nodes <= 5 * 10^4',
 'MEDIUM', 'Linked Lists', 2, 'https://leetcode.com/problems/reorder-list/', 'LEETCODE', TRUE),

('Remove Nth Node From End of List', 'remove-nth-node-from-end-of-list',
 'Given the head of a linked list, remove the nth node from the end of the list and return its head.',
 '1 <= number of nodes <= 30  1 <= n <= number of nodes',
 'MEDIUM', 'Linked Lists', 2, 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/', 'LEETCODE', TRUE),

('Copy List with Random Pointer', 'copy-list-with-random-pointer',
 'A linked list of length n is given such that each node contains an additional random pointer to any node or null. Return a deep copy of the list.',
 '0 <= n <= 1000  -10^4 <= Node.val <= 10^4',
 'MEDIUM', 'Linked Lists', 2, 'https://leetcode.com/problems/copy-list-with-random-pointer/', 'LEETCODE', TRUE),

('Add Two Numbers', 'add-two-numbers',
 'You are given two non-empty linked lists representing two non-negative integers stored in reverse order. Add the two numbers and return the sum as a linked list.',
 '1 <= list length <= 100  0 <= Node.val <= 9',
 'MEDIUM', 'Linked Lists', 2, 'https://leetcode.com/problems/add-two-numbers/', 'LEETCODE', TRUE),

('Linked List Cycle', 'linked-list-cycle',
 'Given head, the head of a linked list, determine if the linked list has a cycle in it. There is a cycle if a node can be reached again by continuously following the next pointer.',
 '0 <= number of nodes <= 10^4  -10^5 <= Node.val <= 10^5',
 'EASY', 'Linked Lists', 2, 'https://leetcode.com/problems/linked-list-cycle/', 'LEETCODE', TRUE),

('Find the Duplicate Number', 'find-the-duplicate-number',
 'Given an array of integers nums containing n + 1 integers, each in the range [1,n], return the duplicate number without modifying the array. Must run in O(n) time and O(1) space.',
 '1 <= n <= 10^5  nums.length == n + 1',
 'MEDIUM', 'Arrays', 2, 'https://leetcode.com/problems/find-the-duplicate-number/', 'LEETCODE', TRUE),

('LRU Cache', 'lru-cache',
 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache. Implement get and put with O(1) average time complexity.',
 '1 <= capacity <= 3000  At most 2 * 10^5 calls.',
 'MEDIUM', 'Linked Lists', 2, 'https://leetcode.com/problems/lru-cache/', 'LEETCODE', TRUE),

('Merge K Sorted Lists', 'merge-k-sorted-lists',
 'You are given an array of k linked-lists, each sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.',
 'k == lists.length  0 <= k <= 10^4  0 <= nodes total <= 10^4',
 'HARD', 'Linked Lists', 2, 'https://leetcode.com/problems/merge-k-sorted-lists/', 'LEETCODE', TRUE),

('Reverse Nodes in K-Group', 'reverse-nodes-in-k-group',
 'Given the head of a linked list, reverse the nodes of the list k at a time and return the modified list. k is a positive integer and is less than or equal to the length of the list.',
 '1 <= number of nodes <= 5000  1 <= k <= number of nodes',
 'HARD', 'Linked Lists', 2, 'https://leetcode.com/problems/reverse-nodes-in-k-group/', 'LEETCODE', TRUE),

-- ---------- Trees (pattern 8) ----------
('Invert Binary Tree', 'invert-binary-tree',
 'Given the root of a binary tree, invert the tree and return its root. The tree is flipped horizontally.',
 '0 <= number of nodes <= 100  -100 <= Node.val <= 100',
 'EASY', 'Trees', 8, 'https://leetcode.com/problems/invert-binary-tree/', 'LEETCODE', TRUE),

('Maximum Depth of Binary Tree', 'maximum-depth-of-binary-tree',
 'Given the root of a binary tree, return its maximum depth. The depth is the number of nodes along the longest path from the root to a leaf.',
 '0 <= number of nodes <= 10^4  -100 <= Node.val <= 100',
 'EASY', 'Trees', 8, 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', 'LEETCODE', TRUE),

('Diameter of Binary Tree', 'diameter-of-binary-tree',
 'Given the root of a binary tree, return the length of the diameter of the tree. The diameter is the number of edges along the longest path between any two nodes.',
 '1 <= number of nodes <= 10^4  -100 <= Node.val <= 100',
 'EASY', 'Trees', 8, 'https://leetcode.com/problems/diameter-of-binary-tree/', 'LEETCODE', TRUE),

('Balanced Binary Tree', 'balanced-binary-tree',
 'Given a binary tree, determine if it is height-balanced. A tree is height-balanced if the heights of the two subtrees of every node never differ by more than one.',
 '0 <= number of nodes <= 5000  -10^4 <= Node.val <= 10^4',
 'EASY', 'Trees', 8, 'https://leetcode.com/problems/balanced-binary-tree/', 'LEETCODE', TRUE),

('Same Tree', 'same-tree',
 'Given the roots of two binary trees p and q, write a function to check if they are the same or not. Two trees are the same if structurally identical and node values equal.',
 '0 <= number of nodes <= 100  -10^4 <= Node.val <= 10^4',
 'EASY', 'Trees', 8, 'https://leetcode.com/problems/same-tree/', 'LEETCODE', TRUE),

('Subtree of Another Tree', 'subtree-of-another-tree',
 'Given the roots of two binary trees root and subRoot, return true if there is a subtree of root with the same structure and node values as subRoot.',
 '1 <= number of nodes <= 2000  -10^4 <= Node.val <= 10^4',
 'EASY', 'Trees', 8, 'https://leetcode.com/problems/subtree-of-another-tree/', 'LEETCODE', TRUE),

('Lowest Common Ancestor of a Binary Search Tree', 'lowest-common-ancestor-of-a-binary-search-tree',
 'Given a binary search tree, find the lowest common ancestor (LCA) of two given nodes in the tree.',
 '2 <= number of nodes <= 10^5  All Node.val are unique.',
 'MEDIUM', 'Trees', 8, 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/', 'LEETCODE', TRUE),

('Binary Tree Level Order Traversal', 'binary-tree-level-order-traversal',
 'Given the root of a binary tree, return the level order traversal of its nodes values, from left to right, level by level.',
 '0 <= number of nodes <= 2000  -1000 <= Node.val <= 1000',
 'MEDIUM', 'Trees', 8, 'https://leetcode.com/problems/binary-tree-level-order-traversal/', 'LEETCODE', TRUE),

('Binary Tree Right Side View', 'binary-tree-right-side-view',
 'Given the root of a binary tree, imagine you stand on the right side of it. Return the values of the nodes you can see, ordered from top to bottom.',
 '0 <= number of nodes <= 100  -100 <= Node.val <= 100',
 'MEDIUM', 'Trees', 8, 'https://leetcode.com/problems/binary-tree-right-side-view/', 'LEETCODE', TRUE),

('Count Good Nodes in Binary Tree', 'count-good-nodes-in-binary-tree',
 'Given a binary tree root, a node X is good if in the path from root to X there are no nodes with a value greater than X. Return the number of good nodes.',
 '1 <= number of nodes <= 10^5  -10^4 <= Node.val <= 10^4',
 'MEDIUM', 'Trees', 8, 'https://leetcode.com/problems/count-good-nodes-in-binary-tree/', 'LEETCODE', TRUE),

('Validate Binary Search Tree', 'validate-binary-search-tree',
 'Given the root of a binary tree, determine if it is a valid binary search tree. A BST is valid if all node values are within the constraints imposed by ancestors.',
 '1 <= number of nodes <= 10^4  -2^31 <= Node.val <= 2^31 - 1',
 'MEDIUM', 'Trees', 8, 'https://leetcode.com/problems/validate-binary-search-tree/', 'LEETCODE', TRUE),

('Kth Smallest Element in a BST', 'kth-smallest-element-in-a-bst',
 'Given the root of a binary search tree and an integer k, return the kth smallest value of all the values of the nodes in the tree.',
 '1 <= number of nodes <= 10^4  1 <= k <= number of nodes',
 'MEDIUM', 'Trees', 8, 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/', 'LEETCODE', TRUE),

('Construct Binary Tree from Preorder and Inorder Traversal', 'construct-binary-tree-from-preorder-and-inorder-traversal',
 'Given two integer arrays preorder and inorder that represent the preorder and inorder traversal of a binary tree, construct and return the binary tree.',
 '1 <= preorder.length <= 3000  inorder length equals preorder length',
 'MEDIUM', 'Trees', 8, 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/', 'LEETCODE', TRUE),

('Binary Tree Maximum Path Sum', 'binary-tree-maximum-path-sum',
 'A path in a binary tree is a sequence of nodes where each pair of adjacent nodes has an edge connecting them. Return the maximum path sum of any non-empty path.',
 '1 <= number of nodes <= 3 * 10^4  -1000 <= Node.val <= 1000',
 'HARD', 'Trees', 8, 'https://leetcode.com/problems/binary-tree-maximum-path-sum/', 'LEETCODE', TRUE),

('Serialize and Deserialize Binary Tree', 'serialize-and-deserialize-binary-tree',
 'Design an algorithm to serialize and deserialize a binary tree. There is no restriction on how the serialization works.',
 '0 <= number of nodes <= 10^4  -1000 <= Node.val <= 1000',
 'HARD', 'Trees', 8, 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/', 'LEETCODE', TRUE),

-- ---------- Tries (pattern 9) ----------
('Implement Trie (Prefix Tree)', 'implement-trie-prefix-tree',
 'A trie (prefix tree) supports insert, search, and startsWith operations for lowercase English words.',
 '1 <= word.length, prefix.length <= 2000  At most 3 * 10^4 calls.',
 'MEDIUM', 'Tries', 9, 'https://leetcode.com/problems/implement-trie-prefix-tree/', 'LEETCODE', TRUE),

('Design Add and Search Words Data Structure', 'design-add-and-search-words-data-structure',
 'Design a data structure that supports adding new words and finding if a string matches any previously added string. The search may contain dots as wildcards matching any letter.',
 '1 <= word.length <= 25  word and searchWord consist only of lowercase letters or dots.',
 'MEDIUM', 'Tries', 9, 'https://leetcode.com/problems/design-add-and-search-words-data-structure/', 'LEETCODE', TRUE),

('Word Search II', 'word-search-ii',
 'Given an m x n board of characters and a list of strings words, return all words on the board. Each word must be constructed from letters of sequentially adjacent cells.',
 '1 <= m, n <= 12  1 <= words.length <= 3 * 10^4',
 'HARD', 'Backtracking', 9, 'https://leetcode.com/problems/word-search-ii/', 'LEETCODE', TRUE),

-- ---------- Heap / Priority Queue (pattern 10) ----------
('Kth Largest Element in a Stream', 'kth-largest-element-in-a-stream',
 'Design a class to find the kth largest element in a stream. Implement add which appends an element and returns the kth largest element.',
 '1 <= k <= 10^4  0 <= nums.length <= 10^4  At most 10^4 calls.',
 'EASY', 'Heaps', 10, 'https://leetcode.com/problems/kth-largest-element-in-a-stream/', 'LEETCODE', TRUE),

('Last Stone Weight', 'last-stone-weight',
 'You are given an array of integers stones. Smash the two heaviest stones together; the heavier stone is reduced by the lighter. Return the weight of the last remaining stone.',
 '1 <= stones.length <= 30  1 <= stones[i] <= 1000',
 'EASY', 'Heaps', 10, 'https://leetcode.com/problems/last-stone-weight/', 'LEETCODE', TRUE),

('K Closest Points to Origin', 'k-closest-points-to-origin',
 'Given an array of points where points[i] = [xi, yi] represents a point on the X-Y plane, return the k closest points to the origin (0, 0).',
 '1 <= k <= points.length <= 10^4  -10^4 <= xi, yi <= 10^4',
 'MEDIUM', 'Heaps', 10, 'https://leetcode.com/problems/k-closest-points-to-origin/', 'LEETCODE', TRUE),

('Kth Largest Element in an Array', 'kth-largest-element-in-an-array',
 'Given an integer array nums and an integer k, return the kth largest element in the array. It is the kth largest element in sorted order, not the kth distinct element.',
 '1 <= k <= nums.length <= 10^5  -10^4 <= nums[i] <= 10^4',
 'MEDIUM', 'Heaps', 10, 'https://leetcode.com/problems/kth-largest-element-in-an-array/', 'LEETCODE', TRUE),

('Task Scheduler', 'task-scheduler',
 'Given a characters array tasks and an integer n where each task can only be done after a cooldown of n, return the least number of units of time the CPU needs to finish all tasks.',
 '1 <= tasks.length <= 10^4  0 <= n <= 100',
 'MEDIUM', 'Heaps', 10, 'https://leetcode.com/problems/task-scheduler/', 'LEETCODE', TRUE),

('Design Twitter', 'design-twitter',
 'Design a simplified version of Twitter where users can post tweets, follow and unfollow other users, and see the 10 most recent tweets in the users news feed.',
 '1 <= userId, followerId, followeeId <= 500  0 <= tweetId <= 10^4  At most 3 * 10^4 calls.',
 'MEDIUM', 'Heaps', 10, 'https://leetcode.com/problems/design-twitter/', 'LEETCODE', TRUE),

('Find Median from Data Stream', 'find-median-from-data-stream',
 'The median is the middle value in an ordered integer list. Design a data structure that supports adding a number and returning the median of all elements.',
 'At most 5 * 10^4 calls to addNum and findMedian.',
 'HARD', 'Heaps', 10, 'https://leetcode.com/problems/find-median-from-data-stream/', 'LEETCODE', TRUE),

-- ---------- Backtracking (pattern 11) ----------
('Subsets', 'subsets',
 'Given an integer array nums of unique elements, return all possible subsets. The solution set must not contain duplicate subsets and may be returned in any order.',
 '1 <= nums.length <= 10  -10 <= nums[i] <= 10',
 'MEDIUM', 'Backtracking', 11, 'https://leetcode.com/problems/subsets/', 'LEETCODE', TRUE),

('Combination Sum', 'combination-sum',
 'Given an array of distinct integers candidates and a target integer, return all unique combinations of candidates where the chosen numbers sum to target. The same number may be used unlimited times.',
 '1 <= candidates.length <= 30  1 <= target <= 40',
 'MEDIUM', 'Backtracking', 11, 'https://leetcode.com/problems/combination-sum/', 'LEETCODE', TRUE),

('Permutations', 'permutations',
 'Given an array nums of distinct integers, return all the possible permutations. You may return the answer in any order.',
 '1 <= nums.length <= 6  -10 <= nums[i] <= 10',
 'MEDIUM', 'Backtracking', 11, 'https://leetcode.com/problems/permutations/', 'LEETCODE', TRUE),

('Subsets II', 'subsets-ii',
 'Given an integer array nums that may contain duplicates, return all possible subsets. The solution set must not contain duplicate subsets.',
 '1 <= nums.length <= 10  -10 <= nums[i] <= 10',
 'MEDIUM', 'Backtracking', 11, 'https://leetcode.com/problems/subsets-ii/', 'LEETCODE', TRUE),

('Combination Sum II', 'combination-sum-ii',
 'Given a collection of candidate numbers and a target, find all unique combinations where the candidate numbers sum to target. Each number in candidates may only be used once.',
 '1 <= candidates.length <= 100  1 <= target <= 30',
 'MEDIUM', 'Backtracking', 11, 'https://leetcode.com/problems/combination-sum-ii/', 'LEETCODE', TRUE),

('Word Search', 'word-search',
 'Given an m x n grid of characters board and a string word, return true if word exists in the grid. Cells may not be re-used in a single path.',
 'm == board.length  n == board[i].length  1 <= m*n <= 250000',
 'MEDIUM', 'Backtracking', 11, 'https://leetcode.com/problems/word-search/', 'LEETCODE', TRUE),

('Palindrome Partitioning', 'palindrome-partitioning',
 'Given a string s, partition s such that every substring of the partition is a palindrome. Return all possible palindrome partitioning of s.',
 '1 <= s.length <= 16',
 'MEDIUM', 'Backtracking', 11, 'https://leetcode.com/problems/palindrome-partitioning/', 'LEETCODE', TRUE),

('Letter Combinations of a Phone Number', 'letter-combinations-of-a-phone-number',
 'Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent. Return the answer in any order.',
 '0 <= digits.length <= 4',
 'MEDIUM', 'Backtracking', 11, 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/', 'LEETCODE', TRUE),

('N-Queens', 'n-queens',
 'The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other. Return all distinct solutions.',
 '1 <= n <= 9',
 'HARD', 'Backtracking', 11, 'https://leetcode.com/problems/n-queens/', 'LEETCODE', TRUE),

-- ---------- Graphs (pattern 12) ----------
('Number of Islands', 'number-of-islands',
 'Given an m x n 2D binary grid of 1s (land) and 0s (water), return the number of islands. An island is surrounded by water and formed by connecting adjacent lands.',
 '1 <= m, n <= 300  grid[i][j] is 0 or 1',
 'MEDIUM', 'Graphs', 12, 'https://leetcode.com/problems/number-of-islands/', 'LEETCODE', TRUE),

('Clone Graph', 'clone-graph',
 'Given a reference of a node in a connected undirected graph, return a deep copy of the graph. Each node contains a value and a list of its neighbors.',
 '0 <= number of nodes <= 100  1 <= Node.val <= 100',
 'MEDIUM', 'Graphs', 12, 'https://leetcode.com/problems/clone-graph/', 'LEETCODE', TRUE),

('Max Area of Island', 'max-area-of-island',
 'You are given an m x n binary matrix grid of 0s and 1s. Return the maximum area of an island in grid, or 0 if no island exists.',
 '1 <= m, n <= 50',
 'MEDIUM', 'Graphs', 12, 'https://leetcode.com/problems/max-area-of-island/', 'LEETCODE', TRUE),

('Pacific Atlantic Water Flow', 'pacific-atlantic-water-flow',
 'There is an m x n rectangular island that borders both the Pacific and Atlantic oceans. Return all cells from which water can flow to both oceans.',
 '1 <= m, n <= 200  0 <= heights[i][j] <= 10^5',
 'MEDIUM', 'Graphs', 12, 'https://leetcode.com/problems/pacific-atlantic-water-flow/', 'LEETCODE', TRUE),

('Surrounded Regions', 'surrounded-regions',
 'Given an m x n matrix board containing X and O, capture all regions surrounded by X. Change all Os that are surrounded by X into Xs.',
 '1 <= m, n <= 200',
 'MEDIUM', 'Graphs', 12, 'https://leetcode.com/problems/surrounded-regions/', 'LEETCODE', TRUE),

('Rotting Oranges', 'rotting-oranges',
 'You are given an m x n grid where each cell can have a value of 0, 1, or 2 (empty, fresh, or rotten orange). Return the minimum number of minutes until all oranges rot, or -1 if impossible.',
 '1 <= m, n <= 10',
 'MEDIUM', 'Graphs', 12, 'https://leetcode.com/problems/rotting-oranges/', 'LEETCODE', TRUE),

('Walls and Gates', 'walls-and-gates',
 'You are given an m x n grid initialized with -1 (gate), 0 (gate), and INF (empty room). Fill each empty room with the distance to its nearest gate.',
 '1 <= m, n <= 250  grid[i][j] is -1, 0, or 2147483647.',
 'MEDIUM', 'Graphs', 12, 'https://leetcode.com/problems/walls-and-gates/', 'LEETCODE', TRUE),

('Course Schedule', 'course-schedule',
 'There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. Given prerequisites pairs, return true if you can finish all courses.',
 '1 <= numCourses <= 2000  0 <= prerequisites.length <= 5000',
 'MEDIUM', 'Graphs', 12, 'https://leetcode.com/problems/course-schedule/', 'LEETCODE', TRUE),

('Course Schedule II', 'course-schedule-ii',
 'There are a total of numCourses courses you have to take. Given the prerequisites pairs, return the ordering of courses you should take to finish all courses.',
 '1 <= numCourses <= 2000  0 <= prerequisites.length <= numCourses * (numCourses - 1) / 2',
 'MEDIUM', 'Graphs', 12, 'https://leetcode.com/problems/course-schedule-ii/', 'LEETCODE', TRUE),

('Redundant Connection', 'redundant-connection',
 'In this problem, a tree is an undirected graph that is connected and has no cycles. Return an edge that can be removed so that the resulting graph is a tree.',
 'n == edges.length  3 <= n <= 1000  edges[i].length == 2',
 'MEDIUM', 'Graphs', 12, 'https://leetcode.com/problems/redundant-connection/', 'LEETCODE', TRUE),

('Number of Connected Components in an Undirected Graph', 'number-of-connected-components-in-an-undirected-graph',
 'There are n nodes numbered from 0 to n - 1 and an edge list. Return the number of connected components in the graph.',
 '1 <= n <= 2000  0 <= edges.length <= 5000',
 'MEDIUM', 'Graphs', 12, 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/', 'LEETCODE', TRUE),

('Graph Valid Tree', 'graph-valid-tree',
 'You have a graph of n nodes labeled from 0 to n - 1. You are given a list of edges. Return true if the edges make up a valid tree.',
 '1 <= n <= 2000  0 <= edges.length <= 5000',
 'MEDIUM', 'Graphs', 12, 'https://leetcode.com/problems/graph-valid-tree/', 'LEETCODE', TRUE),

('Word Ladder', 'word-ladder',
 'A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence with one letter changed at a time. Return the number of words in the shortest transformation sequence or 0.',
 '1 <= beginWord.length <= 10  wordList[i].length == beginWord.length',
 'HARD', 'Graphs', 12, 'https://leetcode.com/problems/word-ladder/', 'LEETCODE', TRUE),

-- ---------- Advanced Graphs (pattern 13) ----------
('Reconstruct Itinerary', 'reconstruct-itinerary',
 'You are given a list of airline tickets where tickets[i] = [fromi, toi]. Return an ordering of airports that starts at JFK and uses every ticket exactly once.',
 '1 <= tickets.length <= 300',
 'HARD', 'Graphs', 13, 'https://leetcode.com/problems/reconstruct-itinerary/', 'LEETCODE', TRUE),

('Min Cost to Connect All Points', 'min-cost-to-connect-all-points',
 'You are given an array points representing integer coordinates of points on a plane. Return the minimum cost to connect all points with the minimum total cost for a spanning tree.',
 '1 <= points.length <= 1000  -10^6 <= xi, yi <= 10^6',
 'MEDIUM', 'Graphs', 13, 'https://leetcode.com/problems/min-cost-to-connect-all-points/', 'LEETCODE', TRUE),

('Network Delay Time', 'network-delay-time',
 'You are given a network of n nodes and a list of directed edges with travel times. Return the minimum time for all nodes to receive the signal or -1 if impossible.',
 '1 <= n <= 100  1 <= k <= n  0 <= times.length <= 6000',
 'MEDIUM', 'Graphs', 13, 'https://leetcode.com/problems/network-delay-time/', 'LEETCODE', TRUE),

('Swim in Rising Water', 'swim-in-rising-water',
 'You are given an n x n integer matrix grid where the water level rises by 1 each day. Return the least time until you can reach the bottom-right cell from the top-left.',
 'n == grid.length  n == grid[i].length  1 <= n <= 50',
 'HARD', 'Graphs', 13, 'https://leetcode.com/problems/swim-in-rising-water/', 'LEETCODE', TRUE),

('Alien Dictionary', 'alien-dictionary',
 'Given a sorted list of words from an alien language, return the order of the characters in the alien language, or the empty string if the order is invalid.',
 '1 <= words.length <= 100  1 <= words[i].length <= 100',
 'HARD', 'Graphs', 13, 'https://leetcode.com/problems/alien-dictionary/', 'LEETCODE', TRUE),

('Cheapest Flights Within K Stops', 'cheapest-flights-within-k-stops',
 'Given a list of flights and a source/destination, return the cheapest price with at most k stops, or -1 if no route exists.',
 '1 <= n <= 100  0 <= flights.length <= n * (n - 1) / 2',
 'MEDIUM', 'Graphs', 13, 'https://leetcode.com/problems/cheapest-flights-within-k-stops/', 'LEETCODE', TRUE),

-- ---------- 1-D Dynamic Programming (pattern 14) ----------
('Climbing Stairs', 'climbing-stairs',
 'You are climbing a staircase. It takes n steps to reach the top and you can climb 1 or 2 steps at a time. Return the number of distinct ways to reach the top.',
 '1 <= n <= 45',
 'EASY', 'Dynamic Programming', 14, 'https://leetcode.com/problems/climbing-stairs/', 'LEETCODE', TRUE),

('Min Cost Climbing Stairs', 'min-cost-climbing-stairs',
 'You are given an integer array cost where cost[i] is the cost of the ith step. Return the minimum cost to reach the top of the floor.',
 '2 <= cost.length <= 1000  0 <= cost[i] <= 999',
 'EASY', 'Dynamic Programming', 14, 'https://leetcode.com/problems/min-cost-climbing-stairs/', 'LEETCODE', TRUE),

('House Robber', 'house-robber',
 'You are a professional robber planning to rob houses along a street. Given the money of each house, return the maximum amount you can rob without robbing adjacent houses.',
 '1 <= nums.length <= 100  0 <= nums[i] <= 400',
 'MEDIUM', 'Dynamic Programming', 14, 'https://leetcode.com/problems/house-robber/', 'LEETCODE', TRUE),

('House Robber II', 'house-robber-ii',
 'You are a professional robber planning to rob houses arranged in a circle. Given the money of each house, return the maximum amount you can rob without robbing adjacent houses.',
 '1 <= nums.length <= 100  0 <= nums[i] <= 1000',
 'MEDIUM', 'Dynamic Programming', 14, 'https://leetcode.com/problems/house-robber-ii/', 'LEETCODE', TRUE),

('Longest Palindromic Substring', 'longest-palindromic-substring',
 'Given a string s, return the longest palindromic substring in s.',
 '1 <= s.length <= 1000',
 'MEDIUM', 'Strings', 14, 'https://leetcode.com/problems/longest-palindromic-substring/', 'LEETCODE', TRUE),

('Palindromic Substrings', 'palindromic-substrings',
 'Given a string s, return the number of palindromic substrings in it.',
 '1 <= s.length <= 1000',
 'MEDIUM', 'Strings', 14, 'https://leetcode.com/problems/palindromic-substrings/', 'LEETCODE', TRUE),

('Decode Ways', 'decode-ways',
 'A message containing letters A-Z is encoded to numbers using a mapping. Given a string s containing digits, return the number of ways to decode it.',
 '1 <= s.length <= 100  s contains only digits and may contain leading zeroes.',
 'MEDIUM', 'Dynamic Programming', 14, 'https://leetcode.com/problems/decode-ways/', 'LEETCODE', TRUE),

('Coin Change', 'coin-change',
 'You are given an integer array coins representing coins of different denominations and an integer amount. Return the fewest number of coins needed to make up that amount, or -1 if not possible.',
 '1 <= coins.length <= 12  0 <= amount <= 10^4',
 'MEDIUM', 'Dynamic Programming', 14, 'https://leetcode.com/problems/coin-change/', 'LEETCODE', TRUE),

('Maximum Product Subarray', 'maximum-product-subarray',
 'Given an integer array nums, return a subarray that has the largest product, and return the product.',
 '1 <= nums.length <= 2 * 10^4  -10 <= nums[i] <= 10',
 'MEDIUM', 'Dynamic Programming', 14, 'https://leetcode.com/problems/maximum-product-subarray/', 'LEETCODE', TRUE),

('Word Break', 'word-break',
 'Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of dictionary words.',
 '1 <= s.length <= 300  1 <= wordDict.length <= 1000',
 'MEDIUM', 'Dynamic Programming', 14, 'https://leetcode.com/problems/word-break/', 'LEETCODE', TRUE),

('Partition Equal Subset Sum', 'partition-equal-subset-sum',
 'Given an integer array nums, return true if you can partition the array into two subsets such that the sum of the elements in both subsets is equal.',
 '1 <= nums.length <= 200  1 <= nums[i] <= 100',
 'MEDIUM', 'Dynamic Programming', 14, 'https://leetcode.com/problems/partition-equal-subset-sum/', 'LEETCODE', TRUE),

('Combination Sum IV', 'combination-sum-iv',
 'Given an array of distinct integers nums and a target integer target, return the number of possible combinations that add up to target. The test cases are generated so that the answer can fit in a 32-bit integer.',
 '1 <= nums.length <= 200  1 <= nums[i] <= 1000  All elements of nums are unique  1 <= target <= 1000',
 'MEDIUM', 'Dynamic Programming', 14, 'https://leetcode.com/problems/combination-sum-iv/', 'LEETCODE', TRUE),

-- ---------- 2-D Dynamic Programming (pattern 15) ----------
('Unique Paths', 'unique-paths',
 'There is a robot on an m x n grid and it wants to reach the bottom-right corner, moving only down or right. Return the number of possible unique paths.',
 '1 <= m, n <= 100',
 'MEDIUM', 'Dynamic Programming', 15, 'https://leetcode.com/problems/unique-paths/', 'LEETCODE', TRUE),

('Longest Common Subsequence', 'longest-common-subsequence',
 'Given two strings text1 and text2, return the length of their longest common subsequence. If there is no common subsequence, return 0.',
 '1 <= text1.length, text2.length <= 1000',
 'MEDIUM', 'Dynamic Programming', 15, 'https://leetcode.com/problems/longest-common-subsequence/', 'LEETCODE', TRUE),

('Best Time to Buy and Sell Stock with Cooldown', 'best-time-to-buy-and-sell-stock-with-cooldown',
 'You are given an array prices where prices[i] is the price of a given stock on the ith day. You can hold at most one share and must wait one day after selling. Return the maximum profit.',
 '1 <= prices.length <= 5000  0 <= prices[i] <= 1000',
 'MEDIUM', 'Dynamic Programming', 15, 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/', 'LEETCODE', TRUE),

('Coin Change II', 'coin-change-ii',
 'You are given an integer array coins and an integer amount. Return the number of combinations that make up that amount.',
 '1 <= coins.length <= 300  1 <= coins[i] <= 5000  0 <= amount <= 5000',
 'MEDIUM', 'Dynamic Programming', 15, 'https://leetcode.com/problems/coin-change-ii/', 'LEETCODE', TRUE),

('Target Sum', 'target-sum',
 'You are given an integer array nums and an integer target. You may assign + or - to each element. Return the number of ways to reach the target.',
 '1 <= nums.length <= 20  0 <= nums[i] <= 1000  0 <= sum(nums[i]) <= 1000',
 'MEDIUM', 'Dynamic Programming', 15, 'https://leetcode.com/problems/target-sum/', 'LEETCODE', TRUE),

('Interleaving String', 'interleaving-string',
 'Given strings s1, s2, and s3, return true if s3 is formed by an interleaving of s1 and s2.',
 '0 <= s1.length, s2.length <= 100  0 <= s3.length <= 200',
 'MEDIUM', 'Dynamic Programming', 15, 'https://leetcode.com/problems/interleaving-string/', 'LEETCODE', TRUE),

('Longest Increasing Path in a Matrix', 'longest-increasing-path-in-a-matrix',
 'Given an m x n integer matrix, return the length of the longest increasing path in the matrix. You may move in four directions and cannot cross a value greater than or equal to the current one.',
 '1 <= m, n <= 200  0 <= matrix[i][j] <= 2^31 - 1',
 'HARD', 'Dynamic Programming', 15, 'https://leetcode.com/problems/longest-increasing-path-in-a-matrix/', 'LEETCODE', TRUE),

('Distinct Subsequences', 'distinct-subsequences',
 'Given two strings s and t, return the number of distinct subsequences of s which equals t.',
 '1 <= s.length, t.length <= 1000',
 'HARD', 'Dynamic Programming', 15, 'https://leetcode.com/problems/distinct-subsequences/', 'LEETCODE', TRUE),

('Edit Distance', 'edit-distance',
 'Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2. Allowed operations: insert, delete, or replace a character.',
 '0 <= word1.length, word2.length <= 500',
 'MEDIUM', 'Dynamic Programming', 15, 'https://leetcode.com/problems/edit-distance/', 'LEETCODE', TRUE),

('Burst Balloons', 'burst-balloons',
 'You are given n balloons, each with a number. Bursting a balloon gives coins equal to the product of its value with its neighbors. Return the maximum coins you can collect.',
 '1 <= n <= 300  0 <= nums[i] <= 100',
 'HARD', 'Dynamic Programming', 15, 'https://leetcode.com/problems/burst-balloons/', 'LEETCODE', TRUE),

('Regular Expression Matching', 'regular-expression-matching',
 'Given an input string s and a pattern p, implement regular expression matching with support for dot matching any character and star matching zero or more of the preceding element.',
 '1 <= s.length <= 20  1 <= p.length <= 20',
 'HARD', 'Dynamic Programming', 15, 'https://leetcode.com/problems/regular-expression-matching/', 'LEETCODE', TRUE),

-- ---------- Greedy (pattern 16) ----------
('Maximum Subarray', 'maximum-subarray',
 'Given an integer array nums, find the subarray with the largest sum and return its sum.',
 '1 <= nums.length <= 10^5  -10^4 <= nums[i] <= 10^4',
 'MEDIUM', 'Dynamic Programming', 16, 'https://leetcode.com/problems/maximum-subarray/', 'LEETCODE', TRUE),

('Jump Game', 'jump-game',
 'You are given an integer array nums where each element is your maximum jump length at that position. Return true if you can reach the last index.',
 '1 <= nums.length <= 10^4  0 <= nums[i] <= 10^5',
 'MEDIUM', 'Greedy', 16, 'https://leetcode.com/problems/jump-game/', 'LEETCODE', TRUE),

('Jump Game II', 'jump-game-ii',
 'You are given a 0-indexed array of integers nums of length n. Return the minimum number of jumps to reach the last index. You can assume you can always reach the last index.',
 '1 <= nums.length <= 10^4  0 <= nums[i] <= 1000',
 'MEDIUM', 'Greedy', 16, 'https://leetcode.com/problems/jump-game-ii/', 'LEETCODE', TRUE),

('Gas Station', 'gas-station',
 'There are n gas stations in a circular route. Given gas and cost arrays, return the starting gas station index from which you can travel around the circuit once, or -1.',
 '1 <= n <= 10^5  0 <= gas[i], cost[i] <= 10^4',
 'MEDIUM', 'Greedy', 16, 'https://leetcode.com/problems/gas-station/', 'LEETCODE', TRUE),

('Hand of Straights', 'hand-of-straights',
 'Alice has a hand of cards and wants to rearrange them into groups of size groupSize with consecutive values. Return true if the rearrangement is possible.',
 '1 <= hand.length <= 10^4  0 <= hand[i] <= 10^9  1 <= groupSize <= hand.length',
 'MEDIUM', 'Greedy', 16, 'https://leetcode.com/problems/hand-of-straights/', 'LEETCODE', TRUE),

('Merge Triplets to Form Target Triplet', 'merge-triplets-to-form-target-triplet',
 'A triplet is an array of three integers. You are given a 2D array triplets and a target triplet. Return true if it is possible to obtain the target by merging some triplets.',
 '1 <= triplets.length <= 10^4',
 'MEDIUM', 'Greedy', 16, 'https://leetcode.com/problems/merge-triplets-to-form-target-triplet/', 'LEETCODE', TRUE),

('Partition Labels', 'partition-labels',
 'You are given a string s. Partition it into as many parts as possible so that each letter appears in at most one part. Return the sizes of the parts.',
 '1 <= s.length <= 500  s consists of lowercase English letters.',
 'MEDIUM', 'Greedy', 16, 'https://leetcode.com/problems/partition-labels/', 'LEETCODE', TRUE),

('Valid Parenthesis String', 'valid-parenthesis-string',
 'Given a string s containing only the characters a-z, ( and *, where * can be treated as a left or right parenthesis or an empty string, return true if the string is valid.',
 '1 <= s.length <= 100',
 'MEDIUM', 'Greedy', 16, 'https://leetcode.com/problems/valid-parenthesis-string/', 'LEETCODE', TRUE),

-- ---------- Intervals (pattern 17) ----------
('Insert Interval', 'insert-interval',
 'You are given a sorted array of non-overlapping intervals and a new interval. Insert newInterval, merging any overlapping intervals, and return the result.',
 '0 <= intervals.length <= 10^4  intervals[i].length == 2',
 'MEDIUM', 'Intervals', 17, 'https://leetcode.com/problems/insert-interval/', 'LEETCODE', TRUE),

('Merge Intervals', 'merge-intervals',
 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals and return an array of the non-overlapping intervals.',
 '1 <= intervals.length <= 10^4  intervals[i].length == 2',
 'MEDIUM', 'Intervals', 17, 'https://leetcode.com/problems/merge-intervals/', 'LEETCODE', TRUE),

('Non-overlapping Intervals', 'non-overlapping-intervals',
 'Given an array of intervals, return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.',
 '1 <= intervals.length <= 10^5',
 'MEDIUM', 'Intervals', 17, 'https://leetcode.com/problems/non-overlapping-intervals/', 'LEETCODE', TRUE),

('Meeting Rooms', 'meeting-rooms',
 'Given an array of meeting time intervals, determine if a person could attend all meetings.',
 '0 <= intervals.length <= 10^4  intervals[i].length == 2',
 'EASY', 'Intervals', 17, 'https://leetcode.com/problems/meeting-rooms/', 'LEETCODE', TRUE),

('Meeting Rooms II', 'meeting-rooms-ii',
 'Given an array of meeting time intervals, return the minimum number of conference rooms required.',
 '1 <= intervals.length <= 10^4',
 'MEDIUM', 'Intervals', 17, 'https://leetcode.com/problems/meeting-rooms-ii/', 'LEETCODE', TRUE),

('Minimum Interval to Include Each Query', 'minimum-interval-to-include-each-query',
 'You are given intervals and an array of queries. Return an array where for each query, the answer is the size of the smallest interval containing the query, or -1.',
 '1 <= intervals.length <= 10^5  intervals[i].length == 2  queries.length <= 10^5',
 'HARD', 'Intervals', 17, 'https://leetcode.com/problems/minimum-interval-to-include-each-query/', 'LEETCODE', TRUE),

-- ---------- Math & Geometry (pattern 18) ----------
('Rotate Image', 'rotate-image',
 'You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees clockwise in place.',
 'n == matrix.length == matrix[i].length  1 <= n <= 20',
 'MEDIUM', 'Arrays', 18, 'https://leetcode.com/problems/rotate-image/', 'LEETCODE', TRUE),

('Spiral Matrix', 'spiral-matrix',
 'Given an m x n matrix, return all elements of the matrix in spiral order.',
 '1 <= m, n <= 10  -100 <= matrix[i][j] <= 100',
 'MEDIUM', 'Arrays', 18, 'https://leetcode.com/problems/spiral-matrix/', 'LEETCODE', TRUE),

('Set Matrix Zeroes', 'set-matrix-zeroes',
 'Given an m x n integer matrix, if an element is 0, set its entire row and column to 0. Do it in place.',
 '1 <= m, n <= 200  -2^31 <= matrix[i][j] <= 2^31 - 1',
 'MEDIUM', 'Arrays', 18, 'https://leetcode.com/problems/set-matrix-zeroes/', 'LEETCODE', TRUE),

('Happy Number', 'happy-number',
 'Write an algorithm to determine if a number n is happy. A happy number eventually reaches 1 when repeatedly replaced by the sum of the squares of its digits.',
 '1 <= n <= 2^31 - 1',
 'EASY', 'Math', 18, 'https://leetcode.com/problems/happy-number/', 'LEETCODE', TRUE),

('Plus One', 'plus-one',
 'You are given a large integer represented as an integer array digits where each digit is a digit of the number. Increment the large integer by one and return the resulting array.',
 '1 <= digits.length <= 100  0 <= digits[i] <= 9',
 'EASY', 'Arrays', 18, 'https://leetcode.com/problems/plus-one/', 'LEETCODE', TRUE),

('Pow(x, n)', 'powx-n',
 'Implement pow(x, n), which calculates x raised to the power n. Must handle negative exponents efficiently.',
 '-100.0 < x < 100.0  -2^31 <= n <= 2^31 - 1',
 'MEDIUM', 'Math', 18, 'https://leetcode.com/problems/powx-n/', 'LEETCODE', TRUE),

('Multiply Strings', 'multiply-strings',
 'Given two non-negative integers num1 and num2 represented as strings, return the product as a string. You must not use any built-in big integer library.',
 '1 <= num1.length, num2.length <= 200',
 'MEDIUM', 'Math', 18, 'https://leetcode.com/problems/multiply-strings/', 'LEETCODE', TRUE),

('Detect Squares', 'detect-squares',
 'You are given a stream of points on the X-Y plane. Design an algorithm that can add points and count the number of axis-aligned squares with the given point as a corner.',
 'At most 3000 calls to add and count.',
 'MEDIUM', 'Math', 18, 'https://leetcode.com/problems/detect-squares/', 'LEETCODE', TRUE),

-- ---------- Bit Manipulation (pattern 19) ----------
('Single Number', 'single-number',
 'Given a non-empty array of integers nums, every element appears twice except for one. Find that single one. Must run in linear time with constant space.',
 '1 <= nums.length <= 3 * 10^4  -3 * 10^4 <= nums[i] <= 3 * 10^4',
 'EASY', 'Bit Manipulation', 19, 'https://leetcode.com/problems/single-number/', 'LEETCODE', TRUE),

('Number of 1 Bits', 'number-of-1-bits',
 'Write a function that takes the binary representation of an unsigned integer and returns the number of 1 bits it has.',
 'Input must be a binary string of length 32.',
 'EASY', 'Bit Manipulation', 19, 'https://leetcode.com/problems/number-of-1-bits/', 'LEETCODE', TRUE),

('Counting Bits', 'counting-bits',
 'Given an integer n, return an array ans of length n + 1 such that for each i, ans[i] is the number of 1 bits in the binary representation of i.',
 '0 <= n <= 10^5',
 'EASY', 'Bit Manipulation', 19, 'https://leetcode.com/problems/counting-bits/', 'LEETCODE', TRUE),

('Reverse Bits', 'reverse-bits',
 'Reverse bits of a given 32 bits unsigned integer.',
 'Input must be a binary string of length 32.',
 'EASY', 'Bit Manipulation', 19, 'https://leetcode.com/problems/reverse-bits/', 'LEETCODE', TRUE),

('Missing Number', 'missing-number',
 'Given an array nums containing n distinct numbers in the range [0, n], return the only number in the range that is missing from the array.',
 '1 <= n <= 10^4  0 <= nums[i] <= n',
 'EASY', 'Bit Manipulation', 19, 'https://leetcode.com/problems/missing-number/', 'LEETCODE', TRUE),

('Sum of Two Integers', 'sum-of-two-integers',
 'Given two integers a and b, return the sum of the two integers without using the operators + and -.',
 '-1000 <= a, b <= 1000',
 'MEDIUM', 'Bit Manipulation', 19, 'https://leetcode.com/problems/sum-of-two-integers/', 'LEETCODE', TRUE),

('Reverse Integer', 'reverse-integer',
 'Given a signed 32-bit integer x, return x with its digits reversed. Return 0 if the result overflows the 32-bit signed integer range.',
 '-2^31 <= x <= 2^31 - 1',
 'MEDIUM', 'Math', 19, 'https://leetcode.com/problems/reverse-integer/', 'LEETCODE', TRUE);

-- ============================================================
-- SHEET MEMBERSHIPS
-- Neetcode 150 (sheet 1) = all 150 problems
-- Blind 75 (sheet 2)     = the classic 75 subset
-- ============================================================

-- NeetCode 150 = exactly the 150 NeetCode problems.
-- Combination Sum IV is a Blind 75 classic but NOT part of NeetCode 150, so it is excluded here.
INSERT INTO coding_sheet_problems (sheet_id, problem_id)
SELECT 1, id FROM coding_problems WHERE slug <> 'combination-sum-iv';

-- Blind 75 subset (the classic 75)
INSERT INTO coding_sheet_problems (sheet_id, problem_id)
SELECT 2, id FROM coding_problems WHERE slug IN (
-- Arrays
'two-sum',
'best-time-to-buy-and-sell-stock',
'contains-duplicate',
'product-of-array-except-self',
'maximum-subarray',
'maximum-product-subarray',
'find-minimum-in-rotated-sorted-array',
'search-in-rotated-sorted-array',
'3sum',
'container-with-most-water',
-- Binary
'sum-of-two-integers',
'number-of-1-bits',
'counting-bits',
'missing-number',
'reverse-bits',
-- Dynamic Programming
'climbing-stairs',
'coin-change',
'longest-increasing-subsequence',
'longest-common-subsequence',
'word-break',
'combination-sum-iv',
'house-robber',
'house-robber-ii',
'decode-ways',
'unique-paths',
'jump-game',
-- Graph
'clone-graph',
'course-schedule',
'pacific-atlantic-water-flow',
'number-of-islands',
'longest-consecutive-sequence',
'alien-dictionary',
'graph-valid-tree',
'number-of-connected-components-in-an-undirected-graph',
-- Interval
'insert-interval',
'merge-intervals',
'non-overlapping-intervals',
'meeting-rooms',
'meeting-rooms-ii',
-- Linked List
'reverse-linked-list',
'linked-list-cycle',
'merge-two-sorted-lists',
'merge-k-sorted-lists',
'remove-nth-node-from-end-of-list',
'reorder-list',
-- Matrix
'set-matrix-zeroes',
'spiral-matrix',
'rotate-image',
'word-search',
-- String
'longest-substring-without-repeating-characters',
'longest-repeating-character-replacement',
'minimum-window-substring',
'valid-anagram',
'group-anagrams',
'valid-parentheses',
'valid-palindrome',
'longest-palindromic-substring',
'palindromic-substrings',
'encode-and-decode-strings',
-- Tree
'maximum-depth-of-binary-tree',
'same-tree',
'invert-binary-tree',
'binary-tree-maximum-path-sum',
'binary-tree-level-order-traversal',
'serialize-and-deserialize-binary-tree',
'subtree-of-another-tree',
'construct-binary-tree-from-preorder-and-inorder-traversal',
'validate-binary-search-tree',
'kth-smallest-element-in-a-bst',
'lowest-common-ancestor-of-a-binary-search-tree',
'word-search-ii',
-- Heap
'top-k-frequent-elements',
'find-median-from-data-stream',
-- Tries
'implement-trie-prefix-tree',
'design-add-and-search-words-data-structure'
);

-- ============================================================
-- CLEANUP: drop the legacy single-sheet column (data moved above)
-- ============================================================
SET @fk_exists := (SELECT COUNT(*) FROM information_schema.TABLE_CONSTRAINTS
                   WHERE table_schema = 'interviewbuddy' AND table_name = 'coding_problems'
                     AND constraint_type = 'FOREIGN KEY' AND constraint_name = 'fk_coding_sheet');
SET @sql_alter := IF(@fk_exists > 0,
                     'ALTER TABLE coding_problems DROP FOREIGN KEY fk_coding_sheet',
                     'SELECT 1');
PREPARE stmt FROM @sql_alter; EXECUTE stmt; DEALLOCATE PREPARE stmt;
SET @idx_exists := (SELECT COUNT(*) FROM information_schema.STATISTICS
                    WHERE table_schema = 'interviewbuddy' AND table_name = 'coding_problems'
                      AND index_name = 'idx_coding_sheet');
SET @sql_idx := IF(@idx_exists > 0, 'ALTER TABLE coding_problems DROP INDEX idx_coding_sheet', 'SELECT 1');
PREPARE stmt FROM @sql_idx; EXECUTE stmt; DEALLOCATE PREPARE stmt;
SET @col_exists := (SELECT COUNT(*) FROM information_schema.COLUMNS
                    WHERE table_schema = 'interviewbuddy' AND table_name = 'coding_problems'
                      AND column_name = 'sheet_id');
SET @sql_col := IF(@col_exists > 0, 'ALTER TABLE coding_problems DROP COLUMN sheet_id', 'SELECT 1');
PREPARE stmt FROM @sql_col; EXECUTE stmt; DEALLOCATE PREPARE stmt;