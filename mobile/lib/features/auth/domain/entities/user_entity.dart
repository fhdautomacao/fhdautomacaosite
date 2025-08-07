enum UserRole {
  admin,
  user,
}

class User {
  final String id;
  final String email;
  final String name;
  final UserRole role;
  final String? avatar;
  final DateTime? lastLogin;
  final Map<String, bool> permissions;

  const User({
    required this.id,
    required this.email,
    required this.name,
    required this.role,
    this.avatar,
    this.lastLogin,
    this.permissions = const {},
  });

  bool get isAdmin => role == UserRole.admin;

  bool hasPermission(String permission) {
    if (isAdmin) return true;
    return permissions[permission] ?? false;
  }

  User copyWith({
    String? id,
    String? email,
    String? name,
    UserRole? role,
    String? avatar,
    DateTime? lastLogin,
    Map<String, bool>? permissions,
  }) {
    return User(
      id: id ?? this.id,
      email: email ?? this.email,
      name: name ?? this.name,
      role: role ?? this.role,
      avatar: avatar ?? this.avatar,
      lastLogin: lastLogin ?? this.lastLogin,
      permissions: permissions ?? this.permissions,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'name': name,
      'role': role.name,
      'avatar': avatar,
      'lastLogin': lastLogin?.toIso8601String(),
      'permissions': permissions,
    };
  }

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? '',
      email: json['email'] ?? '',
      name: json['name'] ?? '',
      role: UserRole.values.firstWhere(
        (e) => e.name == json['role'],
        orElse: () => UserRole.user,
      ),
      avatar: json['avatar'],
      lastLogin: json['lastLogin'] != null 
        ? DateTime.parse(json['lastLogin'])
        : null,
      permissions: Map<String, bool>.from(json['permissions'] ?? {}),
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is User && other.id == id;
  }

  @override
  int get hashCode => id.hashCode;

  @override
  String toString() {
    return 'User(id: $id, email: $email, name: $name, role: $role)';
  }
}